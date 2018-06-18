import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import { transformFontName, transformFontFamily } from '../Utils/Font.js';
import FrameGroup from './Groups/Frame.js';
import TextGroup from './Groups/Text.js';
import FontGroup from './Groups/Font.js';
import ColorGroup from './Groups/Color.js';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUILabelViewForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
        <FrameGroup prefix="frame" {...props} />
        <TextGroup {...props} />
        <FontGroup {...props} />
        { props.viewProps.backgroundColor ? (
          <ColorGroup titles={{alpha: "Alpha", color: "Background"}} {...props} />
          ): null
        }
    </form>
  );
}

const EnhancedUILabelViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    // Frame
    frame: {
      x: props.viewProps.frame.minX,
      y: props.viewProps.frame.minY,
      width: props.viewProps.frame.maxX - props.viewProps.frame.minX,
      height: props.viewProps.frame.maxY - props.viewProps.frame.minY
    },
    // Color
    alpha: props.viewProps.backgroundColor ? props.viewProps.backgroundColor.alpha : null,
    colorHex: props.viewProps.backgroundColor ? props.viewProps.backgroundColor.hexValue : null,
    // Text
    text: props.viewProps.text,
    // Font
    fontFamily: props.viewProps.font ? transformFontFamily(props.systemMetadata.fonts.systemFont, props.viewProps.font.familyName) : null,
    fontStyle: props.viewProps.font ? transformFontName(props.viewProps.font.fontName) : null,
    pointSize: props.viewProps.font ? props.viewProps.font.pointSize : null,
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
  displayName: 'UILabelViewForm', // helps with React DevTools
})(InnerUILabelViewForm);

const UILabelViewForm = props => {
  return <EnhancedUILabelViewForm {...props} />
}

export default UILabelViewForm;