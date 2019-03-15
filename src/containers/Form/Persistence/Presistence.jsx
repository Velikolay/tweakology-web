import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import { withFormikContext } from '../../../contexts/Form/FormikContext';

const dispatchFormikBag = ({ formik }) => formik.onFormSelect(formik);

class FormikPersistence extends Component {
  saveForm = debounce((name, data) => {
    const { excludeDeviceContext } = this.props;
    if (excludeDeviceContext) {
      const { device, ...other } = data;
      window.localStorage.setItem(name, JSON.stringify(other));
    } else {
      window.localStorage.setItem(name, JSON.stringify(data));
    }
    console.log('Form saved');
  }, this.props.debounce);

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
    const maybeState = window.localStorage.getItem(props.name);

    let modifiedProps = props.formik;
    if (maybeState && maybeState !== null) {
      modifiedProps = JSON.parse(maybeState);
    }

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
      // console.log('Form Loaded');
    }
  };

  render() {
    return null;
  }
}

export const readPersistedValues = id => {
  const maybeState = window.localStorage.getItem(id);
  return maybeState ? JSON.parse(maybeState).values : null;
};

export const readPersistedConstraints = () => {
  const constraints = {};
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const id = window.localStorage.key(i);
    const formState = window.localStorage.getItem(id);
    if (formState) {
      const state = JSON.parse(formState);
      if (
        state.type === 'NSLayoutConstraint' &&
        (state.dirty || state.values.meta.added)
      ) {
        const viewId = id.split('.')[0];
        if (!(viewId in constraints)) {
          constraints[viewId] = [];
        }
        constraints[viewId].push(state);
      }
    }
  }

  Object.values(constraints).forEach(constraint =>
    constraint.sort(
      (a, b) =>
        parseInt(a.id.split(':')[1], 10) > parseInt(b.id.split(':')[1], 10),
    ),
  );

  return constraints;
};

FormikPersistence.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  debounce: PropTypes.number,
  excludeDeviceContext: PropTypes.bool,
};

FormikPersistence.defaultProps = {
  debounce: 300,
  excludeDeviceContext: true,
};

export default withFormikContext(FormikPersistence);
