import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import FormikObserver from 'formik-observer';

import Persist from './Persistence/Presistence';
import { withFormikContextProvider } from './FormikContext';

import Constraint from './Groups/Constraint';

const InnerNSLayoutConstraint = ({
  id,
  type,
  formData,
  handleSubmit,
  onFormChange,
}) => (
  <form onSubmit={handleSubmit}>
    <Constraint itemOptions={formData.itemOptions} />
    <FormikObserver
      onChange={({ values }) => onFormChange(id, type, values)}
    />
    <Persist name={id} />
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
  displayName: 'NSLayoutConstraint',
})(withFormikContextProvider(InnerNSLayoutConstraint));

const NSLayoutConstraint = props => <EnhancedNSLayoutConstraint {...props} />;

InnerNSLayoutConstraint.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
};

export default NSLayoutConstraint;
