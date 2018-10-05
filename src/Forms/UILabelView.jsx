import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { withFormikContextProvider } from './FormikContext';
import Persist from './Persistence/Presistence';

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
  values,
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
    { values.backgroundColor ? (
      <React.Fragment>
        <hr />
        <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />
      </React.Fragment>
    ) : null
      }
    <Persist name={id} />
  </form>
);

const EnhancedUILabelViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({
    systemContext,
    formData: {
      frame,
      ...rest
    },
  }) => ({
    frame: {
      x: frame.minX,
      y: frame.minY,
      width: frame.maxX - frame.minX,
      height: frame.maxY - frame.minY,
    },
    ...UILabelTransformer.fromPayload(rest, systemContext),
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
  displayName: 'UILabelViewForm',
})(withFormikContextProvider(InnerUILabelViewForm));

const UILabelViewForm = props => <EnhancedUILabelViewForm {...props} />;

InnerUILabelViewForm.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.any.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UILabelViewForm;
