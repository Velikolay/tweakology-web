import React from 'react';
import { withFormik } from 'formik';

import { withFormikShell } from './FormikShell';
import { withFormikContextProvider } from './FormikContext';

import { ContentModeOptions, SemanticContentAttributeOptions } from '../Static/UIView';
import UIButtonTransformer from '../Transformers/UIButton';
import FrameGroup from './Groups/Frame';
import InputField from './Groups/InputField';
import SelectField from './Groups/SelectField';
import FontGroup from './Groups/Font';
import ColorGroup from './Groups/Color';

const InnerUIButtonViewForm = () => (
  <React.Fragment>
    <FrameGroup prefix="frame" />
    <hr />
    <SelectField name="contentMode" options={ContentModeOptions} title="Content Mode" />
    <SelectField name="semanticContentAttribute" options={SemanticContentAttributeOptions} title="Semantic" />
    <hr />
    <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />
    <hr />
    <InputField name="title.text" type="text" title="Title" />
    <FontGroup prefix="title.font" />
    <ColorGroup prefix="title.textColor" titles={{ alpha: 'Opacity', color: 'Text Color' }} />
  </React.Fragment>
);

const EnhancedUIButtonViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => UIButtonTransformer.fromPayload(props.formData, props.systemContext),
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
  displayName: 'UIButtonViewForm',
})(withFormikContextProvider(withFormikShell(InnerUIButtonViewForm)));

const UIButtonViewForm = props => <EnhancedUIButtonViewForm {...props} />;

InnerUIButtonViewForm.propTypes = {};

export default UIButtonViewForm;
