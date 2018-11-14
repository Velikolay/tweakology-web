// @flow
import type { UIImageView } from '../Device/Types';
import UIViewTransformer from './UIView';
import UIImageTransformer from './UIImage';

const UIImageViewTransformer = {
  fromPayload: (props: UIImageView) => ({
    ...UIViewTransformer.fromPayload(props),
    image: UIImageTransformer.fromPayload(props.image || {}),
    highlightedImage: UIImageTransformer.fromPayload(
      props.highlightedImage || { src: '' },
    ),
  }),

  toPayload: (props: any): UIImageView => ({
    ...UIViewTransformer.toPayload(props),
    image: UIImageTransformer.toPayload(props.image),
    highlightedImage: UIImageTransformer.toPayload(props.highlightedImage),
  }),
};

export default UIImageViewTransformer;
