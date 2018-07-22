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
      x: props.viewProps.frame.minX,
      y: props.viewProps.frame.minY,
      width: props.viewProps.frame.maxX - props.viewProps.frame.minX,
      height: props.viewProps.frame.maxY - props.viewProps.frame.minY
    },
    // Background color
    backgroundColor: props.viewProps.backgroundColor,
    // Text
    text: props.viewProps.text,
    // Text color
    textColor: props.viewProps.textColor,
    // Font
    font: {
      familyName: props.viewProps.font ? transformFontFamily(props.systemMetadata.fonts.systemFont, props.viewProps.font.familyName) : null,
      fontStyle: props.viewProps.font ? transformFontName(props.viewProps.font.fontName) : null,
      pointSize: props.viewProps.font ? props.viewProps.font.pointSize : null
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