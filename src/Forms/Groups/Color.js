import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import './Groups.css';
import './Color.css';

// Our inner form component. Will be wrapped with Formik({..})
const ColorGroup = props => {
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
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          Alpha
        </label>
        <input
          id="alpha"
          placeholder=""
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={values.alpha}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.alpha && touched.alpha ? 'full-width-input error' : 'full-width-input'}
        />
      </div>
      <div className="form-row">
        <label className="input-title">
          Background
        </label>
        <input
          id="colorHex"
          placeholder=""
          type="text"
          value={values.colorHex}
          onChange={handleChange}
          onBlur={handleBlur}
          className="color-input"
        />
        <input
          type="color"
          value={values.colorHex}
          className="color-picker-input"
          onChange={event => props.setFieldValue("colorHex", event.target.value)}
        />
      </div>
    </div>
  );
}

// const EnhancedColorForm = withFormik({
//   enableReinitialize: true,
//   mapPropsToValues: props => ({ alpha: props.alpha, colorHex: props.colorHex }),
//   // validationSchema: Yup.object().shape({
//   //   email: Yup.string()
//   //     .email('Invalid email address')
//   //     .required('Email is required!'),
//   // }),
//   handleSubmit: (values, { setSubmitting }) => {
//     setTimeout(() => {
//       alert(JSON.stringify(values, null, 2));
//       setSubmitting(false);
//     }, 1000);
//   },
//   displayName: 'ColorForm', // helps with React DevTools
// })(InnerColorForm);

// const ColorForm = props => {
//   return <EnhancedColorForm {...props} />
// }

export default ColorGroup;