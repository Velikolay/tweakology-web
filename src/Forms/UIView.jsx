import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
// import Yup from 'yup';

import { withFormikContextProvider } from './FormikContext';
import Persist from './Persistence/Presistence';
import { ContentModeOptions, SemanticContentAttributeOptions } from '../Static/UIView';
import UIViewTransformer from '../Transformers/UIView';
import SelectField from './Groups/SelectField';
import FrameGroup from './Groups/Frame';
import ColorGroup from './Groups/Color';

const InnerUIViewForm = ({
  id,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <FrameGroup prefix="frame" />
    <hr />
    <SelectField name="contentMode" options={ContentModeOptions} title="Content Mode" />
    <SelectField name="semanticContentAttribute" options={SemanticContentAttributeOptions} title="Semantic" />
    <hr />
    <ColorGroup prefix="backgroundColor" titles={{ alpha: 'Alpha', color: 'Background' }} />

    <Persist name={id} />
  </form>
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
})(withFormikContextProvider(InnerUIViewForm));

const UIViewForm = props => <EnhancedUIViewForm {...props} />;

InnerUIViewForm.propTypes = {
  id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UIViewForm;
