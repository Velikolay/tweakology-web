import './helper.css';
import { MoreResources, DisplayFormikState } from './helper';

import React from 'react';
import { render } from 'react-dom';
import { withFormik } from 'formik';
import Yup from 'yup';

// Our inner form component. Will be wrapped with Formik({..})
const MyInnerForm = props => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email" style={{ display: 'block' }}>
        Email
      </label>
      <input
        id="email"
        placeholder="Enter your email"
        type="text"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.email && touched.email ? 'text-input error' : 'text-input'}
      />
      {errors.email &&
      touched.email && <div className="input-feedback">{errors.email}</div>}

      <button
        type="button"
        className="outline"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
      >
        Reset
      </button>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>

      <DisplayFormikState {...props} />
    </form>
  );
};

const EnhancedForm = withFormik({
  mapPropsToValues: () => ({ email: '' }),
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
  displayName: 'BasicForm', // helps with React DevTools
})(MyInnerForm);

const ViewForm = () => (
  <div className="view-form">
    <h1>
      Basic{' '}
      <a href="https://github.com/jaredpalmer/formik" target="_blank" rel="noopener">
        Formik
      </a>{' '}
      Demo
    </h1>

    <EnhancedForm />
    <MoreResources />
  </div>
);

export default ViewForm;