// @flow
import type { UIImageView as UIImageViewPayload } from '../../../../services/device/types';
import type { UIImageView as UIImageViewForm } from '../../../../containers/Form/types';

import withFalsyGuard from './utils';
import UIViewTransformer from './UIView';
import UIImageTransformer from './UIImage';

const UIImageViewTransformer = {
  fromPayload: (props: UIImageViewPayload): UIImageViewForm => ({
    ...UIViewTransformer.fromPayload(props),
    image: UIImageTransformer.fromPayload(props.image || {}),
    highlightedImage: UIImageTransformer.fromPayload(
      props.highlightedImage || { src: '' },
    ),
  }),

  toPayload: (props: UIImageViewForm): UIImageViewPayload => ({
    ...UIViewTransformer.toPayload(props),
    image: UIImageTransformer.toPayload(props.image),
    highlightedImage: UIImageTransformer.toPayload(props.highlightedImage),
  }),
};

export default withFalsyGuard(UIImageViewTransformer);
