import React from 'react';
import { withFormik } from 'formik';
import { Persist } from './Persistence/Presistence'
// import { Persist } from 'formik-persist'
import Yup from 'yup';

import { transformFontName, transformFontFamily } from '../Utils/Font';
import FrameGroup from './Groups/Frame';
import TextGroup from './Groups/Text';
import FontGroup from './Groups/Font';
import ColorGroup from './Groups/Color';

// Our inner form component. Will be wrapped with Formik({..})
const InnerUILabelViewForm = props => {
  return (
    <form onSubmit={props.handleSubmit}>
      <FrameGroup prefix="frame" {...props} />
      <hr/>
      <TextGroup {...props} />
      <FontGroup prefix="font" {...props} />
      <ColorGroup prefix="textColor" titles={{alpha: "Opacity", color: "Text Color"}} {...props} />
      { props.values.backgroundColor ? (
        <div>
          <hr/>
          <ColorGroup prefix="backgroundColor" titles={{alpha: "Alpha", color: "Background"}} {...props} />
        </div>
        ): null
      }
      <Persist name={props.id} formik={props} />
    </form>
  );
};

const EnhancedUILabelViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    // Frame
    frame: {
      x: props.formData.frame.minX,
      y: props.formData.frame.minY,
      width: props.formData.frame.maxX - props.formData.frame.minX,
      height: props.formData.frame.maxY - props.formData.frame.minY
    },
    // Background color
    backgroundColor: props.formData.backgroundColor,
    // Text
    text: props.formData.text,
    // Text color
    textColor: props.formData.textColor,
    // Font
    font: {
      familyName: props.formData.font ? transformFontFamily(props.systemMetadata.fonts.systemFont, props.formData.font.familyName) : null,
      fontStyle: props.formData.font ? transformFontName(props.formData.font.fontName) : null,
      pointSize: props.formData.font ? props.formData.font.pointSize : null
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
  displayName: 'UILabelViewForm', // helps with React DevTools
})(InnerUILabelViewForm);

const UILabelViewForm = props => {
  return <EnhancedUILabelViewForm {...props} />
};

export default UILabelViewForm;