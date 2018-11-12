import UIViewTransformer from './UIView';
import FontTransformer from './UIFont';

const UIButtonLabelTransformer = {
  fromPayload: (props, systemContext) => ({
    text: props.text,
    textColor: props.textColor,
    font: FontTransformer.fromPayload(props.font, systemContext),
  }),

  toPayload: (props, systemContext) => ({
    text: props.text,
    textColor: props.textColor,
    font: FontTransformer.toPayload(props.font, systemContext),
  }),
};

const UIButtonTransformer = {
  fromPayload: (props, systemContext) => ({
    ...UIViewTransformer.fromPayload(props),
    title: UIButtonLabelTransformer.fromPayload(
      props.title.properties,
      systemContext,
    ),
  }),

  toPayload: (props, systemContext) => ({
    ...UIViewTransformer.toPayload(props),
    title: UIButtonLabelTransformer.toPayload(props.title, systemContext),
  }),
};

export default UIButtonTransformer;
