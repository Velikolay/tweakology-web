import getTransformer from '../transformers/form';

export default {
  mapStateToProps: state => {
    const {
      activeNode: { id, type, properties },
      device,
      ...other
    } = state;
    const formData = getTransformer(type).fromPayload(properties, device);

    return {
      id,
      type,
      formData,
      ...other,
    };
  },
};
