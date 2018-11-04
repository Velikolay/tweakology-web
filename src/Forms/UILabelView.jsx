import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { withFormikContextProvider } from './FormikContext';
import Persist from './Persistence/Presistence';
import { ContentModeOptions, SemanticContentAttributeOptions } from '../Static/UIView';
import { LineBreakModeOptions, BaselineOptions } from '../Static/UILabel';
import UILabelTransformer from '../Transformers/UILabel';
import FrameGroup from './Groups/Frame';
import InputField from './Groups/InputField';
import SelectField from './Groups/SelectField';
import TextAlignmentGroup from './Groups/TextAlignment';
import FontGroup from './Groups/Font';
import ColorGroup from './Groups/Color';

const InnerUILabelViewForm = ({
  id,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <FrameGroup prefix="frame" />
    <hr />
    <InputField name="text" type="text" title="Text" />
    <TextAlignmentGroup />
    <InputField name="numberOfLines" type="number" min={1} title="Lines" />
    <FontGroup prefix="font" />
    <ColorGroup prefix="textColor" titles={{ alpha: 'Opacity', color: 'Text Color' }} />
    <hr />
    <SelectField name="baselineAdjustment" options={BaselineOptions} title="Baseline" />
    <SelectField name="lineBreakMode" options={LineBreakModeOptions} title="Line Break" />
    <hr />
    <SelectField name="contentMode" options={ContentModeOptions} title="Content Mode" />
    <SelectField name="semanticContentAttribute" options={SemanticContentAttributeOptions} title="Semantic" />
    <hr />
    <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />

    <Persist name={id} />
  </form>
);

const EnhancedUILabelViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: props => UILabelTransformer.fromPayload(props.formData, props.systemContext),
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
  displayName: 'UILabelViewForm',
})(withFormikContextProvider(InnerUILabelViewForm));

const UILabelViewForm = props => <EnhancedUILabelViewForm {...props} />;

InnerUILabelViewForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UILabelViewForm;
