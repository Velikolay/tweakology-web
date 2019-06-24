import getTransformer from '../transformers/form';

export default {
  mapStateToProps: (state, device) => {
    const {
      activeNode: { id, type, properties },
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
