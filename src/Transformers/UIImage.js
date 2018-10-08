const UIImageTransformer = {

  fromPayload: ({ src }) => ({
    src: src || '',
  }),

  toPayload: props => props,
};

export default UIImageTransformer;
