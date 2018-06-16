import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import './Groups.css';

// Our inner form component. Will be wrapped with Formik({..})
const FrameGroup = props => {
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
          Frame
        </label>
        <div className="half-width-input">
          <input
            id="x_coord"
            placeholder=""
            type="number"
            value={values.x_coord}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.x_coord && touched.x_coord ? 'num-input error' : 'num-input'}
          />
          {errors.x_coord &&
          touched.x_coord && <div className="input-feedback">{errors.x_coord}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            X
          </label>
        </div>
        <div className="half-width-input">
          <input
            id="y_coord"
            placeholder=""
            type="number"
            value={values.y_coord}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.y_coord && touched.y_coord ? 'num-input error' : 'num-input'}
          />
          {errors.y_coord &&
          touched.y_coord && <div className="input-feedback">{errors.y_coord}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            Y
          </label>
        </div>
      </div>
      <div className="form-row">
        <label className="input-title" />
        <div className="half-width-input">
          <input
            id="width"
            placeholder=""
            type="number"
            value={values.width}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.width && touched.width ? 'num-input error' : 'num-input'}
          />
          {errors.width &&
          touched.width && <div className="input-feedback">{errors.width}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            Width
          </label>
        </div>
        <div className="half-width-input">
          <input
            id="height"
            placeholder=""
            type="number"
            value={values.height}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.height && touched.height ? 'num-input error' : 'num-input'}
          />
          {errors.height &&
          touched.height && <div className="input-feedback">{errors.height}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            Height
          </label>
        </div>
      </div>
    </div>
  );
};

// const EnhancedFrameForm = withFormik({
//   enableReinitialize: true,
//   mapPropsToValues: props => ({ name: props.name, x_coord: props.x, y_coord: props.y, width: props.width, height: props.height }),
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
//   displayName: 'FrameForm', // helps with React DevTools
// })(InnerFrameForm);

// const FrameForm = props => (
//     <EnhancedFrameForm {...props}/>
// );

export default FrameGroup;