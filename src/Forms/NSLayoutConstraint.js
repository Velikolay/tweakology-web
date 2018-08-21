import React from 'react';
import { withFormik } from 'formik';
import FormikObserver from 'formik-observer';
import Yup from 'yup';
import { Persist } from './Persistence/Presistence';
// import { Persist } from 'formik-persist'

import Constraint from './Groups/Constraint';

// Our inner form component. Will be wrapped with Formik({..})
const InnerNSLayoutConstraint = props => (
  <form onSubmit={props.handleSubmit}>
    <Constraint itemOptions={props.formData.itemOptions} formik={props} />
    <FormikObserver
      onChange={({ values }) => props.onFormChange(props.id, props.type, values)}
    />
    <Persist name={props.id} formik={props} />
  </form>
);

const EnhancedNSLayoutConstraint = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => props.formData.constraint,
  // validationSchema: Yup.object().shape({
  //   email: Yup.string()
  //     .email('Invalid email address')
  //     .required('Email is required!'),
  // }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'NSLayoutConstraint', // helps with React DevTools
})(InnerNSLayoutConstraint);

const NSLayoutConstraint = props => <EnhancedNSLayoutConstraint {...props} />;

export default NSLayoutConstraint;
