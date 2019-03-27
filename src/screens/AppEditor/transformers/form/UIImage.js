// @flow
import type { UIImage } from '../../../../services/device/types';
import withFalsyGuard from './utils';

const UIImageTransformer = {
  fromPayload: ({ src }: UIImage) => ({
    src: src || '',
  }),

  toPayload: (props: any): UIImage => props,
};

export default withFalsyGuard(UIImageTransformer);
