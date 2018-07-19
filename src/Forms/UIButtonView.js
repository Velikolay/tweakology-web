import React from 'react';
import { withFormik } from 'formik';
import { Persist } from 'formik-persist'
import Yup from 'yup';

import { transformFontName, transformFontFamily } from '../Utils/Font';
import FrameGroup from './Groups/Frame';
import TextGroup from './Groups/Text';
import FontGroup from './Groups/Font';
import ColorGroup from './Groups/Color';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUIButtonViewForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
        <FrameGroup prefix="frame" {...props} />
        <hr/>
        <ColorGroup prefix="backgroundColor" titles={{alpha: "Alpha", color: "Background"}} {...props} />
        <hr/>
        <TextGroup prefix="title" titles={{text: "Title"}} {...props} />
        <FontGroup prefix="title.font" {...props} />
        <ColorGroup prefix="title.textColor" titles={{alpha: "Opacity", color: "Text Color"}} {...props} />
        <Persist name={props.id} />
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
    // Background color
    backgroundColor: props.viewProps.backgroundColor,
    // Title
    title: {
      // Title Text
      text: props.viewProps.title.properties.text,
      // Title Color
      textColor: props.viewProps.title.properties.textColor,
      // Title Font
      font: {
        familyName: transformFontFamily(props.systemMetadata.fonts.systemFont, props.viewProps.title.properties.font.familyName),
        fontStyle: transformFontName(props.viewProps.title.properties.font.fontName),
        pointSize: props.viewProps.title.properties.font.pointSize
      }
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