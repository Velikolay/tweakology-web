import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { withFormikContextProvider } from './FormikContext';
import Persist from './Persistence/Presistence';

import UIButtonTransformer from '../Transformers/UIButton';
import FrameGroup from './Groups/Frame';
import InputField from './Groups/InputField';
import FontGroup from './Groups/Font';
import ColorGroup from './Groups/Color';

const InnerUIButtonViewForm = ({
  id,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <FrameGroup prefix="frame" />
    <hr />
    <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />
    <hr />
    <InputField name="title.text" type="text" title="Title" />
    <FontGroup prefix="title.font" />
    <ColorGroup prefix="title.textColor" titles={{ alpha: 'Opacity', color: 'Text Color' }} />
    <Persist name={id} />
  </form>
);

const EnhancedUIButtonViewForm = withFormik({
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
    ...UIButtonTransformer.fromPayload(rest, systemContext),
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
  displayName: 'UIButtonViewForm',
})(withFormikContextProvider(InnerUIButtonViewForm));

const UIButtonViewForm = props => <EnhancedUIButtonViewForm {...props} />;

InnerUIButtonViewForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UIButtonViewForm;
