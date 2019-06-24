// @flow
import type { UIScrollView as UIScrollViewPayload } from '../../../../services/device/types';
import type { UIScrollView as UIScrollViewForm } from '../../components/Form/types';

import withFalsyGuard from './utils';
import UIViewTransformer from './UIView';

const UIScrollViewTransformer = {
  fromPayload: (props: UIScrollViewPayload): UIScrollViewForm => ({
    ...UIViewTransformer.fromPayload(props),
    contentOffset: props.contentOffset,
    contentSize: props.contentSize,
  }),

  toPayload: (props: UIScrollViewForm): UIScrollViewPayload => ({
    ...UIViewTransformer.toPayload(props),
    contentOffset: props.contentOffset,
    contentSize: props.contentSize,
  }),
};

export default withFalsyGuard(UIScrollViewTransformer);
