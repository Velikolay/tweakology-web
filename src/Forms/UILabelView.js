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
        <Persist name={props.id} />
    </form>
  );
};

const EnhancedUILabelViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => ({
    // Frame
    frame: {
      x: props.formProps.frame.minX,
      y: props.formProps.frame.minY,
      width: props.formProps.frame.maxX - props.formProps.frame.minX,
      height: props.formProps.frame.maxY - props.formProps.frame.minY
    },
    // Background color
    backgroundColor: props.formProps.backgroundColor,
    // Text
    text: props.formProps.text,
    // Text color
    textColor: props.formProps.textColor,
    // Font
    font: {
      familyName: props.formProps.font ? transformFontFamily(props.systemMetadata.fonts.systemFont, props.formProps.font.familyName) : null,
      fontStyle: props.formProps.font ? transformFontName(props.formProps.font.fontName) : null,
      pointSize: props.formProps.font ? props.formProps.font.pointSize : null
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