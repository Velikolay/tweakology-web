// @flow
import type {
  UIButton as UIButtonPayload,
  UIButtonLabel as UIButtonLabelPayload,
} from '../../../../services/device/types';

import type {
  UIButton as UIButtonForm,
  UIButtonLabel as UIButtonLabelForm,
} from '../../../../containers/Form/types';
import withFalsyGuard from './utils';
import UIViewTransformer from './UIView';
import UIFontTransformer from './UIFont';

const UIButtonLabelTransformer = {
  fromPayload: (
    props: UIButtonLabelPayload,
    device: any,
  ): UIButtonLabelForm => ({
    ...UIViewTransformer.fromPayload(props),
    text: props.text,
    textColor: props.textColor,
    font: UIFontTransformer.fromPayload(props.font, device),
    numberOfLines: props.numberOfLines,
    textAlignment: props.textAlignment,
    baselineAdjustment: props.baselineAdjustment.toString(),
    lineBreakMode: props.lineBreakMode.toString(),
  }),

  toPayload: (props: UIButtonLabelForm, device): UIButtonLabelPayload => ({
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
  fromPayload: (props: UIButtonPayload, device: any): UIButtonForm => ({
    ...UIViewTransformer.fromPayload(props),
    title: UIButtonLabelTransformer.fromPayload(props.title, device),
  }),

  toPayload: (props: UIButtonForm, device: any): UIButtonPayload => ({
    ...UIViewTransformer.toPayload(props),
    title: UIButtonLabelTransformer.toPayload(props.title, device),
  }),
};

export default withFalsyGuard(UIButtonTransformer);
