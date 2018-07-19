import React from 'react';
import { withFormik } from 'formik';
import { Persist } from 'formik-persist'
import Yup from 'yup';

import FrameGroup from './Groups/Frame';
import ColorGroup from './Groups/Color';
import Constraint from './Groups/Constraint';

import ConstraintTransformer from './Transformers/Constraints';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUIViewForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
        <FrameGroup prefix="frame" {...props} />
        { props.values.backgroundColor? (
          <div>
            <hr/>
            <ColorGroup prefix="backgroundColor" titles={{alpha: "Alpha", color: "Background"}} {...props} />
          </div>
          ): null
        }
        <hr/>
        <Constraint prefix="constraint" formik={props} />
        <Persist name={props.id} />
    </form>
  );
}

const EnhancedUIViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    // Frame
    frame: {
      x: props.viewProps.frame.minX,
      y: props.viewProps.frame.minY,
      width: props.viewProps.frame.maxX - props.viewProps.frame.minX,
      height: props.viewProps.frame.maxY - props.viewProps.frame.minY
    },
    // Background color
    backgroundColor: props.viewProps.backgroundColor,
    // Test constraint
    constraint: ConstraintTransformer.payloadToFormikProps({
      relation: '0',
      first: {
        item: 'ZDNjNGRhNW',
        attribute: '7'
      },
      second: {
        item: 'MGQ3MDAyZD',
        attribute: '7'
      },
      constant: 0,
      priority: 1000,
      multiplier: 1
    })
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

const UIViewForm = props => {
  return <EnhancedUIViewForm {...props} />
}

export default UIViewForm;