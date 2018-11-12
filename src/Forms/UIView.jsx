import React from 'react';
import { withFormik } from 'formik';
// import Yup from 'yup';

import { withFormikShell } from './FormikShell';
import { withFormikContextProvider } from './FormikContext';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../Static/UIView';
import UIViewTransformer from '../Transformers/UIView';
import SelectField from './Groups/SelectField';
import FrameGroup from './Groups/Frame';
import ColorGroup from './Groups/Color';

const InnerUIViewForm = () => (
  <React.Fragment>
    <FrameGroup prefix="frame" />
    <hr />
    <SelectField
      name="contentMode"
      options={ContentModeOptions}
      title="Content Mode"
    />
    <SelectField
      name="semanticContentAttribute"
      options={SemanticContentAttributeOptions}
      title="Semantic"
    />
    <hr />
    <ColorGroup
      prefix="backgroundColor"
      titles={{ alpha: 'Alpha', color: 'Background' }}
    />
  </React.Fragment>
);

const EnhancedUIViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => UIViewTransformer.fromPayload(props.formData),
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
  displayName: 'UIViewForm',
})(withFormikContextProvider(withFormikShell(InnerUIViewForm)));

const UIViewForm = props => <EnhancedUIViewForm {...props} />;

InnerUIViewForm.propTypes = {};

export default UIViewForm;
