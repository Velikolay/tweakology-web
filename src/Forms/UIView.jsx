import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { withFormikContextProvider } from './FormikContext';
// import Yup from 'yup';
import Persist from './Persistence/Presistence';

import FrameGroup from './Groups/Frame';
import ColorGroup from './Groups/Color';

const InnerUIViewForm = ({
  id,
  values,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit}>
    <FrameGroup prefix="frame" />
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

const EnhancedUIViewForm = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ formData: { frame, backgroundColor } }) => ({
    // Frame
    frame: {
      x: frame.minX,
      y: frame.minY,
      width: frame.maxX - frame.minX,
      height: frame.maxY - frame.minY,
    },
    // Background color
    backgroundColor,
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
  displayName: 'UIViewForm',
})(withFormikContextProvider(InnerUIViewForm));

const UIViewForm = props => <EnhancedUIViewForm {...props} />;

InnerUIViewForm.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.any.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UIViewForm;
