// @flow
import type { UIView as UIViewPayload } from '../../../../services/device/types';
import type { UIView as UIViewForm } from '../../components/Form/types';

import withFalsyGuard from './utils';

const UIViewTransformer = {
  fromPayload: (props: UIViewPayload, device: any): UIViewForm => ({
    frame: props.frame,
    backgroundColor: props.backgroundColor,
    contentMode: props.contentMode.toString(),
    semanticContentAttribute: props.semanticContentAttribute.toString(),
  }),

  toPayload: (props: UIViewForm, device: any): UIViewPayload => ({
    frame: props.frame,
    backgroundColor: props.backgroundColor,
    contentMode: parseInt(props.contentMode, 10),
    semanticContentAttribute: parseInt(props.semanticContentAttribute, 10),
  }),
};

export default withFalsyGuard(UIViewTransformer);
