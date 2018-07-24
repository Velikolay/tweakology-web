import React from 'react';
import { withFormik } from 'formik';
import { Persist } from 'formik-persist'
import Yup from 'yup';

import Constraint from './Groups/Constraint';

import ConstraintTransformer from './Transformers/Constraints';

// Our inner form component. Will be wrapped with Formik({..})
const InnerNSLayoutConstraint = props => {
  return (
    <form onSubmit={props.handleSubmit}>
        <Constraint itemOptions={props.viewProps.itemOptions} formik={props} />
        {/* <Persist name={props.id} /> */}
    </form>
  );
};

const EnhancedNSLayoutConstraint = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ConstraintTransformer.payloadToFormikProps(props.viewProps.constraint),
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

const NSLayoutConstraint = props => {
  return <EnhancedNSLayoutConstraint {...props} />
};

export default NSLayoutConstraint;