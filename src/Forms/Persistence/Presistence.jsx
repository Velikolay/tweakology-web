import { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import isEqual from 'lodash.isequal';

import { withFormikContext } from '../FormikContext';

const dispatchFormikBag = ({ formik }) => formik.onFormSelect(formik);

class FormikPersistence extends Component {
  saveForm = debounce((name, data) => {
    if (this.props.excludeSystemContext) {
      const { systemContext, ...other } = data;
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
    if (nextProps.name !== name) {
      this.setForm(nextProps);
    } else if (!isEqual(nextProps.formik, formik)) {
      // console.log('Form saving..');
      this.saveForm(nextProps.name, nextProps.formik);
    } else {
      // console.log('Form wont save');
    }
    dispatchFormikBag(nextProps);
  }

  setForm = props => {
    // console.log('Form loading..');
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
  excludeSystemContext: PropTypes.bool,
};

FormikPersistence.defaultProps = {
  debounce: 300,
  excludeSystemContext: true,
};

export default withFormikContext(FormikPersistence);
