import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import { AttributeFormikShape } from '../../components/Form/Shapes';
import PersistenceService from '../../services/persistence';

import { withFormikContext } from '../../contexts/FormikContext';

const dispatchFormikBag = ({ formik }) => formik.eventHandler('select', formik);

class FormikPersistence extends Component {
  saveForm = debounce((name, data) => {
    const { excludeDeviceContext } = this.props;
    if (excludeDeviceContext) {
      const { device, ...other } = data;
      PersistenceService.write(name, other);
    } else {
      PersistenceService.write(name, data);
    }
  }, this.props.debounce); // eslint-disable-line react/destructuring-assignment

  componentDidMount() {
    this.setForm(this.props);
    dispatchFormikBag(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { name, formik } = this.props;
    /*
      This is a fragile logic for handling form resets caused by enableReinitialize.
      It is used to set forms of the same type(e.g. UILabel, UIButton) with persisted values when clicked sequentially
      Works with formik version 1.5.1
    */
    if (!isEqual(formik.initialValues, nextProps.formik.initialValues)) {
      this.setForm(nextProps);
    }

    if (name === nextProps.name && !isEqual(formik, nextProps.formik)) {
      this.saveForm(nextProps.name, nextProps.formik);
    }

    dispatchFormikBag(nextProps);
  }

  setForm = props => {
    const modifiedProps = PersistenceService.read(props.name) || props.formik;
    const { values, errors, touched, isSubmitting, status } = modifiedProps;

    const { formik } = this.props;
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

  render() {
    return null;
  }
}

FormikPersistence.propTypes = {
  name: PropTypes.string.isRequired,
  formik: AttributeFormikShape.isRequired,
  debounce: PropTypes.number,
  excludeDeviceContext: PropTypes.bool,
};

FormikPersistence.defaultProps = {
  debounce: 300,
  excludeDeviceContext: true,
};

export default withFormikContext(FormikPersistence);
