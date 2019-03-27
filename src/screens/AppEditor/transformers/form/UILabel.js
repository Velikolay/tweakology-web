import withFalsyGuard from './utils';
import UIViewTransformer from './UIView';
import UIFontTransformer from './UIFont';

const UILabelTransformer = {
  fromPayload: (props, device) => ({
    ...UIViewTransformer.fromPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: UIFontTransformer.fromPayload(props.font, device),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: props.baselineAdjustment.toString(),
    lineBreakMode: props.lineBreakMode.toString(),
  }),

  toPayload: (props, device) => ({
    ...UIViewTransformer.toPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: UIFontTransformer.toPayload(props.font, device),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: parseInt(props.baselineAdjustment, 10),
    lineBreakMode: parseInt(props.lineBreakMode, 10),
  }),
};

export default withFalsyGuard(UILabelTransformer);
