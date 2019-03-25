import React from 'react';
import PropTypes from 'prop-types';

import { withDeviceContext } from '../../../contexts/DeviceContext';
import { TreeNodeShape } from '../../../containers/Tree/Shapes';

import Form from '../../../containers/Form/Form';

import getTransformer from '../data-transformers/form';

class FormAdaptor extends React.PureComponent {
  render() {
    const { activeNode, device, ...other } = this.props;
    const formData = getTransformer(activeNode.type).fromPayload(
      activeNode.properties,
      device,
    );
    return (
      <Form
        id={activeNode.id}
        type={activeNode.type}
        formData={formData}
        {...other}
      />
    );
  }
}

FormAdaptor.propTypes = {
  activeNode: TreeNodeShape.isRequired,
  device: PropTypes.object.isRequired,
};

export default withDeviceContext(FormAdaptor);
