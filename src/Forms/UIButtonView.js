import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import { transformFontName, transformFontFamily } from '../Utils/Font.js';
import FrameGroup from './Groups/Frame.js';
import TextGroup from './Groups/Text.js';
import FontGroup from './Groups/Font.js';
import ColorGroup from './Groups/Color.js';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUIButtonViewForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
        <FrameGroup prefix="frame" {...props} />
        <ColorGroup titles={{alpha: "Alpha", color: "Background"}} {...props} />
        <TextGroup prefix="title" titles={{text: "Title"}} {...props} />
        <FontGroup prefix="title" {...props} />
        <ColorGroup prefix="title" titles={{alpha: "Opacity", color: "Text Color"}} {...props} />
    </form>
  );
}

const EnhancedUIButtonViewForm = withFormik({
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
    alpha: props.viewProps.backgroundColor.alpha,
    colorHex: props.viewProps.backgroundColor.hexValue,
    // Title
    title: {
      // Title Text
      text: props.viewProps.title.properties.text,
      // Title Color
      alpha: props.viewProps.title.properties.textColor.alpha,
      colorHex: props.viewProps.title.properties.textColor.hexValue,
      // Title Font
      fontFamily: transformFontFamily(props.systemMetadata.fonts.systemFont, props.viewProps.title.properties.font.familyName),
      fontStyle: transformFontName(props.viewProps.title.properties.font.fontName),
      pointSize: props.viewProps.title.properties.font.pointSize
    }
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
  displayName: 'UIButtonViewForm', // helps with React DevTools
})(InnerUIButtonViewForm);

const UIButtonViewForm = props => {
  return <EnhancedUIButtonViewForm {...props} />
}

export default UIButtonViewForm;