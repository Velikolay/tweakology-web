// @flow
import type { UIButton, UIButtonLabel } from '../services/device/types';

import UIViewTransformer from './UIView';
import UIFontTransformer from './UIFont';

const UIButtonLabelTransformer = {
  fromPayload: (props: UIButtonLabel, device: any) => ({
    ...UIViewTransformer.fromPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: UIFontTransformer.fromPayload(props.font, device),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: props.baselineAdjustment.toString(),
    lineBreakMode: props.lineBreakMode.toString(),
  }),

  toPayload: (props: any, device): UIButtonLabel => ({
    ...UIViewTransformer.toPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: UIFontTransformer.toPayload(props.font),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: parseInt(props.baselineAdjustment, 10),
    lineBreakMode: parseInt(props.lineBreakMode, 10),
  }),
};

const UIButtonTransformer = {
  fromPayload: (props: UIButton, device: any) => ({
    ...UIViewTransformer.fromPayload(props),
    title: UIButtonLabelTransformer.fromPayload(props.title, device),
  }),

  toPayload: (props: any, device: any): UIButton => ({
    ...UIViewTransformer.toPayload(props),
    title: UIButtonLabelTransformer.toPayload(props.title, device),
  }),
};

export default UIButtonTransformer;
