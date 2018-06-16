import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import './Groups.css';

// Our inner form component. Will be wrapped with Formik({..})

const FontGroup = props => {
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
          Font Family
        </label>
        <select
          id="fontFamily"
          className="full-width-input"
          onChange={handleChange}
        >
          {
            props.systemMetadata.fonts.families.map(fontFamily => fontFamily === values.fontFamily ? <option selected> {fontFamily} </option> : <option> {fontFamily} </option>)
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title">
          Font Style
        </label>
        <select
          id="fontStyle"
          className="full-width-input"
          onChange={handleChange}
        >
          {
            props.systemMetadata.fonts.styles[values.fontFamily].map(fontStyle => fontStyle === values.fontStyle ? <option selected> {fontStyle} </option> : <option> {fontStyle} </option>)
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title">
          Size
        </label>
        <input
          id="pointSize"
          placeholder=""
          type="number"
          min={0}
          value={values.pointSize}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.pointSize && touched.pointSize ? 'full-width-input error' : 'full-width-input'}
        />
      </div>
    </div>
  );
}

// const EnhancedFontForm = withFormik({
//   enableReinitialize: true,
//   mapPropsToValues: props => ({ fontStyle: props.fontStyle, fontFamily: props.fontFamily, pointSize: props.pointSize }),
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
//   displayName: 'FontForm', // helps with React DevTools
// })(InnerFontForm);

// const FontForm = props => {
//   return <EnhancedFontForm {...props} />
// }

export default FontGroup;