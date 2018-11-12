import UIViewTransformer from './UIView';
import UIImageTransformer from './UIImage';

const UIImageViewTransformer = {
  fromPayload: props => ({
    ...UIViewTransformer.fromPayload(props),
    image: UIImageTransformer.fromPayload(props.image || {}),
    highlightedImage: UIImageTransformer.fromPayload(
      props.highlightedImage || {},
    ),
  }),

  toPayload: props => ({
    ...UIViewTransformer.toPayload(props),
    image: UIImageTransformer.toPayload(props.image),
    highlightedImage: UIImageTransformer.toPayload(props.highlightedImage),
  }),
};

export default UIImageViewTransformer;
