import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { FormDataShape } from './Shapes';
import { withFormikContextProvider } from '../../contexts/FormikContext';
import { withFormikShell } from './FormikShell';

import getAttributesComponent from './Sections/Attributes';

const getAttributesComponentWithFormik = type => {
  return withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => props.formData,
    displayName: type,
  })(withFormikContextProvider(withFormikShell(getAttributesComponent(type))));
};

const FormContainer = props => {
  const { type } = props;
  const AttributesComponent = getAttributesComponentWithFormik(type);
  return <AttributesComponent {...props} />;
};

FormContainer.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  formData: FormDataShape.isRequired,
  eventHandler: PropTypes.func.isRequired,
};

export default FormContainer;
