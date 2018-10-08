import FontTransformer from './UIFont';

const UIButtonLabelTransformer = {

  fromPayload: ({
    textAlignment,
    numberOfLines,
    baselineAdjustment,
    lineBreakMode,
    font,
    ...rest
  }, systemContext) => ({
    font: FontTransformer.fromPayload(font, systemContext),
    ...rest,
  }),

  toPayload: ({
    font,
    ...rest
  }, systemContext) => ({
    font: FontTransformer.toPayload(font, systemContext),
    ...rest,
  }),
};

const UIButtonTransformer = {

  fromPayload: ({
    title: { properties: buttonLabel },
    ...rest
  }, systemContext) => ({
    title: UIButtonLabelTransformer.fromPayload(buttonLabel, systemContext),
    ...rest,
  }),

  toPayload: ({
    title,
    ...rest
  }, systemContext) => ({
    title: UIButtonLabelTransformer.toPayload(title, systemContext),
    ...rest,
  }),
};

export default UIButtonTransformer;
