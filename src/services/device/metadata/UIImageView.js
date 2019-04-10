import CGRect from './CGRect';

const UIImageView = {
  name: 'Image View',
  type: 'UIImageView',
  description:
    'Displays a single image, or an animation described by an array of images.',
  init: id => ({
    frame: CGRect.init(),
    properties: {
      image: {
        src: 'EmptyImage',
      },
    },
  }),
};

export default UIImageView;
