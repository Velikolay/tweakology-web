import UIImageTransformer from './UIImage';

const UIImageViewTransformer = {

  fromPayload: ({ image, highlightedImage, ...rest }) => ({
    image: UIImageTransformer.fromPayload(image || {}),
    highlightedImage: UIImageTransformer.fromPayload(highlightedImage || {}),
    ...rest,
  }),

  toPayload: props => props,
};

export default UIImageViewTransformer;
