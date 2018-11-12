import React from 'react';
import { withFormik } from 'formik';

import { withFormikShell } from './FormikShell';
import { withFormikContextProvider } from './FormikContext';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../Static/UIView';
import UIImageViewTransformer from '../Transformers/UIImageView';
import FrameGroup from './Groups/Frame';
import InputField from './Groups/InputField';
import SelectField from './Groups/SelectField';
import ColorGroup from './Groups/Color';

const InnerUIImageViewForm = () => (
  <React.Fragment>
    <FrameGroup prefix="frame" />
    <hr />
    <InputField
      name="image.src"
      type="text"
      title="Image"
      placeholder="Image name or url"
    />
    <InputField
      name="highlightedImage.src"
      type="text"
      title="Highlighted"
      placeholder="Image name or url"
    />
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

const EnhancedUIImageViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => UIImageViewTransformer.fromPayload(props.formData),
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
  displayName: 'UIImageViewForm',
})(withFormikContextProvider(withFormikShell(InnerUIImageViewForm)));

const UIImageViewForm = props => <EnhancedUIImageViewForm {...props} />;

InnerUIImageViewForm.propTypes = {};

export default UIImageViewForm;
