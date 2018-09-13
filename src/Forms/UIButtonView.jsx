import React from 'react';
import { withFormik } from 'formik';
import { withFormikContextProvider } from './FormikContext';
import Yup from 'yup';
import { Persist } from './Persistence/Presistence';
// import { Persist } from 'formik-persist'

import { transformFontName, transformFontFamily } from '../Utils/Font';
import FrameGroup from './Groups/Frame';
import TextGroup from './Groups/Text';
import FontGroup from './Groups/Font';
import ColorGroup from './Groups/Color';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUIButtonViewForm = props => (
  <form onSubmit={props.handleSubmit}>
    <FrameGroup prefix="frame" />
    <hr />
    <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />
    <hr />
    <TextGroup prefix="title" titles={{ text: 'Title' }} />
    <FontGroup prefix="title.font" />
    <ColorGroup prefix="title.textColor" titles={{ alpha: 'Opacity', color: 'Text Color' }} />
    <Persist name={props.id} formik={props} />
  </form>
);

const EnhancedUIButtonViewForm = withFormik({
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
    // Title
    title: {
      // Title Text
      text: props.formData.title.properties.text,
      // Title Color
      textColor: props.formData.title.properties.textColor,
      // Title Font
      font: {
        familyName: transformFontFamily(props.systemMetadata.fonts.systemFont, props.formData.title.properties.font.familyName),
        fontStyle: transformFontName(props.formData.title.properties.font.fontName),
        pointSize: props.formData.title.properties.font.pointSize,
      },
    },
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
})(withFormikContextProvider(InnerUIButtonViewForm));

const UIButtonViewForm = props => <EnhancedUIButtonViewForm {...props} />;

export default UIButtonViewForm;
