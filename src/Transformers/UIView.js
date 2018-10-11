const UIViewTransformer = {

  fromPayload: ({
    frame,
    backgroundColor,
    contentMode,
    semanticContentAttribute,
  }, systemContext) => ({
    frame: {
      x: frame.minX,
      y: frame.minY,
      width: frame.maxX - frame.minX,
      height: frame.maxY - frame.minY,
    },
    backgroundColor,
    contentMode: contentMode.toString(),
    semanticContentAttribute: semanticContentAttribute.toString(),
  }),

  toPayload: ({
    frame,
    backgroundColor,
    contentMode,
    semanticContentAttribute,
  }, systemContext) => ({
    frame,
    backgroundColor,
    contentMode: parseInt(contentMode, 10),
    semanticContentAttribute: parseInt(semanticContentAttribute, 10),
  }),
};

export default UIViewTransformer;
