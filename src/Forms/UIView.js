import React from 'react';
import { withFormik } from 'formik';
import Yup from 'yup';

import { transformFontName, transformFontFamily } from '../Utils/Font.js';
import FrameGroup from './Groups/Frame.js';
import TextGroup from './Groups/Text.js';
import FontGroup from './Groups/Font.js';
import ColorGroup from './Groups/Color.js';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUIViewForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
        <FrameGroup  {...props} />
        { props.viewProps.text ? (
          <TextGroup {...props} />
          ): null
        }
        { props.viewProps.font ? (
          <FontGroup {...props} />
          ): null
        }
        { props.viewProps.backgroundColor ? (
          <ColorGroup  {...props} />
          ): null
        }
    </form>
  );
}

const EnhancedUIViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    // Frame
    x_coord: props.viewProps.frame ? props.viewProps.frame.minX : null,
    y_coord: props.viewProps.frame ? props.viewProps.frame.minY : null,
    width: props.viewProps.frame ? props.viewProps.frame.maxX - props.viewProps.frame.minX : null,
    height: props.viewProps.frame ? props.viewProps.frame.maxY - props.viewProps.frame.minY : null,
    // Color
    alpha: props.viewProps.backgroundColor ? props.viewProps.backgroundColor.alpha : null,
    colorHex: props.viewProps.backgroundColor ? props.viewProps.backgroundColor.hexValue : null,
    // Font
    fontFamily: props.viewProps.font ? transformFontFamily(props.systemMetadata.fonts.systemFont, props.viewProps.font.familyName) : null,
    fontStyle: props.viewProps.font ? transformFontName(props.viewProps.font.fontName) : null,
    pointSize: props.viewProps.font ? props.viewProps.font.pointSize : null,
    // Text
    text: props.viewProps.text,
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