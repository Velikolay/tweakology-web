import UIViewTransformer from './UIView';
import FontTransformer from './UIFont';

const UILabelTransformer = {
  fromPayload: (props, systemContext) => ({
    ...UIViewTransformer.fromPayload(props),
    text: props.text,
    textColor: props.textColor,
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: props.baselineAdjustment.toString(),
    lineBreakMode: props.lineBreakMode.toString(),
    font: FontTransformer.fromPayload(props.font, systemContext),
  }),

  toPayload: (props, systemContext) => ({
    ...UIViewTransformer.toPayload(props),
    text: props.text,
    textColor: props.textColor,
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: parseInt(props.baselineAdjustment, 10),
    lineBreakMode: parseInt(props.lineBreakMode, 10),
    font: FontTransformer.toPayload(props.font, systemContext),
  }),
};

export default UILabelTransformer;
