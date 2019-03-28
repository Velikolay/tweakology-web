// @flow
import type { UIImage as UIImagePayload } from '../../../../services/device/types';
import type { UIImage as UIImageForm } from '../../../../containers/Form/types';

import withFalsyGuard from './utils';

const UIImageTransformer = {
  fromPayload: (props: UIImagePayload): UIImageForm => ({
    src: props.src || '',
  }),

  toPayload: (props: UIImageForm): UIImagePayload => props,
};

export default withFalsyGuard(UIImageTransformer);
