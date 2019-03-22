import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import { withDeviceContext } from '../../contexts/DeviceContext';

import { withFormikContextProvider } from '../../contexts/FormikContext';
import { withFormikShell } from './FormikShell';

import getAttributesComponent from '../../components/Form/Sections/Attributes';
import getTransformer from '../../transformers';

const getAttributesComponentWithFormik = type => {
  return withFormik({
    enableReinitialize: true,
    mapPropsToValues: props =>
      getTransformer(type).fromPayload(props.formData, props.device),
    displayName: type,
  })(withFormikContextProvider(withFormikShell(getAttributesComponent(type))));
};

class Form extends React.PureComponent {
  render() {
    const { type } = this.props;
    const AttributesComponent = getAttributesComponentWithFormik(type);
    return <AttributesComponent {...this.props} />;
  }
}

Form.propTypes = {
  type: PropTypes.string.isRequired,
};

export default withDeviceContext(Form);
