import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';
import { Persist } from './Persistence/Presistence';
// import { Persist } from 'formik-persist'

import FrameGroup from './Groups/Frame';
import ColorGroup from './Groups/Color';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUIViewForm = props => (
  <form onSubmit={props.handleSubmit}>
    <FrameGroup prefix="frame" {...props} />
    { props.values.backgroundColor ? (
      <div>
        <hr />
        <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} {...props} />
      </div>
    ) : null
      }
    <Persist name={props.id} formik={props} />
  </form>
);

const EnhancedUIViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    // Frame
    frame: {
      x: props.formData.frame.minX,
      y: props.formData.frame.minY,
      width: props.formData.frame.maxX - props.formData.frame.minX,
      height: props.formData.frame.maxY - props.formData.frame.minY,
    },
    // Background color
    backgroundColor: props.formData.backgroundColor,
  }),
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
  displayName: 'UIViewForm', // helps with React DevTools
})(InnerUIViewForm);

const UIViewForm = props => <EnhancedUIViewForm {...props} />;

export default UIViewForm;
