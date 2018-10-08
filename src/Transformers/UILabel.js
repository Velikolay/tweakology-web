import FontTransformer from './UIFont';

const UILabelTransformer = {

  fromPayload: ({
    baselineAdjustment,
    lineBreakMode,
    font,
    ...rest
  }, systemContext) => ({
    baselineAdjustment: baselineAdjustment.toString(),
    lineBreakMode: lineBreakMode.toString(),
    font: FontTransformer.fromPayload(font, systemContext),
    ...rest,
  }),

  toPayload: ({
    baselineAdjustment,
    lineBreakMode,
    font,
    ...rest
  }, systemContext) => ({
    baselineAdjustment: parseInt(baselineAdjustment, 10),
    lineBreakMode: parseInt(lineBreakMode, 10),
    font: FontTransformer.toPayload(font, systemContext),
    ...rest,
  }),
};

export default UILabelTransformer;
