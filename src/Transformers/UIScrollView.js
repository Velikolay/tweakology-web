// @flow
import type { UIScrollView } from '../services/device/types';
import UIViewTransformer from './UIView';

const UIScrollViewTransformer = {
  fromPayload: (props: UIScrollView) => ({
    ...UIViewTransformer.fromPayload(props),
    contentOffset: props.contentOffset,
    contentSize: props.contentSize,
  }),

  toPayload: (props: any): UIScrollView => ({
    ...UIViewTransformer.toPayload(props),
    contentOffset: props.contentOffset,
    contentSize: props.contentSize,
  }),
};

export default UIScrollViewTransformer;
