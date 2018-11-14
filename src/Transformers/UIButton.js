// @flow
import type { UIButton, UIButtonLabel } from '../Device/Types';

import UIViewTransformer from './UIView';
import FontTransformer from './UIFont';

const UIButtonLabelTransformer = {
  fromPayload: (props: UIButtonLabel, systemContext: any) => ({
    ...UIViewTransformer.fromPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: FontTransformer.fromPayload(props.font, systemContext),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: props.baselineAdjustment.toString(),
    lineBreakMode: props.lineBreakMode.toString(),
  }),

  toPayload: (props: any, systemContext): UIButtonLabel => ({
    ...UIViewTransformer.toPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: FontTransformer.toPayload(props.font),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: parseInt(props.baselineAdjustment, 10),
    lineBreakMode: parseInt(props.lineBreakMode, 10),
  }),
};

const UIButtonTransformer = {
  fromPayload: (props: UIButton, systemContext: any) => ({
    ...UIViewTransformer.fromPayload(props),
    title: UIButtonLabelTransformer.fromPayload(props.title, systemContext),
  }),

  toPayload: (props: any, systemContext: any): UIButton => ({
    ...UIViewTransformer.toPayload(props),
    title: UIButtonLabelTransformer.toPayload(props.title, systemContext),
  }),
};

export default UIButtonTransformer;
