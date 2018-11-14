// @flow
import type { UIImage } from '../Device/Types';

const UIImageTransformer = {
  fromPayload: ({ src }: UIImage) => ({
    src: src || '',
  }),

  toPayload: (props: any): UIImage => props,
};

export default UIImageTransformer;
