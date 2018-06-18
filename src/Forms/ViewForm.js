import React from 'react';

import UIButtonView from './UIButtonView';
import UILabelView from './UILabelView';
import UIView from './UIView';

const ViewForm = props => {
  if (props.type === 'UIButton') {
    return <UIButtonView {...props} />;
  } else if (props.type === 'UILabel' || props.type === 'UIButtonLabel') {
    return <UILabelView {...props} />;
  } else {
    return <UIView {...props} />;
  }
}

export default ViewForm;