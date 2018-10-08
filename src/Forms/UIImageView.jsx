import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { withFormikContextProvider } from './FormikContext';
import UIImageViewTransformer from '../Transformers/UIImageView';
import Persist from './Persistence/Presistence';
import FrameGroup from './Groups/Frame';
import InputField from './Groups/InputField';
import ColorGroup from './Groups/Color';

const InnerUIImageViewForm = ({
  id,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <FrameGroup prefix="frame" />
    <hr />
    <InputField name="image.src" type="text" title="Image" placeholder="Image name or url" />
    <InputField name="highlightedImage.src" type="text" title="Highlighted" placeholder="Image name or url" />
    <hr />
    <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />
    <Persist name={id} />
  </form>
);

const EnhancedUIImageViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({
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
    ...UIImageViewTransformer.fromPayload(rest),
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
  displayName: 'UIImageViewForm',
})(withFormikContextProvider(InnerUIImageViewForm));

const UIImageViewForm = props => <EnhancedUIImageViewForm {...props} />;

InnerUIImageViewForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UIImageViewForm;
