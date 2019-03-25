// @flow
import type { UIView } from '../../../../services/device/types';

const UIViewTransformer = {
  fromPayload: (
    { frame, backgroundColor, contentMode, semanticContentAttribute }: UIView,
    device: any,
  ) => ({
    frame,
    backgroundColor,
    contentMode: contentMode.toString(),
    semanticContentAttribute: semanticContentAttribute.toString(),
  }),

  toPayload: (
    { frame, backgroundColor, contentMode, semanticContentAttribute }: any,
    device: any,
  ): UIView => ({
    frame,
    backgroundColor,
    contentMode: parseInt(contentMode, 10),
    semanticContentAttribute: parseInt(semanticContentAttribute, 10),
    isHidden: false,
  }),
};

export default UIViewTransformer;
