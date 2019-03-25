// @flow
import type { UIImage } from '../../../../services/device/types';

const UIImageTransformer = {
  fromPayload: ({ src }: UIImage) => ({
    src: src || '',
  }),

  toPayload: (props: any): UIImage => props,
};

export default UIImageTransformer;
