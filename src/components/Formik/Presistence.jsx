import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import PersistenceService from '../../services/persistence';

import FormikShape from './shapes';

export const setForm = (formik, modified) => {
  const { values, errors, touched, isSubmitting, status } = modified;

  if (formik) {
    if (values) {
      formik.setValues(values);
    }

    if (errors) {
      formik.setErrors(errors);
    }

    if (touched) {
      formik.setTouched(touched);
    }

    if (isSubmitting) {
      formik.setSubmitting(isSubmitting);
    }

    if (status) {
      formik.setStatus(status);
    }
  }
};

class FormikPersistence extends Component {
  saveForm = debounce((name, data) => {
    PersistenceService.write(name, data);
  }, this.props.debounce); // eslint-disable-line react/destructuring-assignment

  componentDidMount() {
    this.setForm(this.props);
    this.dispatchFormikBag(this.props);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { name, formik, autosave } = this.props;
    /*
      This is a fragile logic for handling form resets caused by enableReinitialize.
      It is used to set forms of the same type(e.g. UILabel, UIButton) with persisted values when clicked sequentially
      Works with formik version 1.5.1
    */
    if (!isEqual(formik.initialValues, nextProps.formik.initialValues)) {
      this.setForm(nextProps);
    }

    if (
      autosave &&
      name === nextProps.name &&
      !isEqual(formik, nextProps.formik)
    ) {
      this.saveForm(nextProps.name, nextProps.formik);
    }

    this.dispatchFormikBag(nextProps);
  }

  dispatchFormikBag = ({ formik, onChange }) => {
    onChange(formik);
  };

  setForm = props => {
    const modified = PersistenceService.read(props.name) || props.formik;
    const { formik } = this.props;
    setForm(formik, modified);
  };

  render() {
    return null;
  }
}

FormikPersistence.propTypes = {
  name: PropTypes.string.isRequired,
  formik: FormikShape.isRequired,
  autosave: PropTypes.bool,
  debounce: PropTypes.number,
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: PropTypes.func,
};

FormikPersistence.defaultProps = {
  autosave: true,
  debounce: 300,
  onChange: () => {},
};

export default FormikPersistence;
