import React from 'react';

import UIButtonView from './UIButtonView';
import UILabelView from './UILabelView';
import NSLayoutConstraint from './NSLayoutConstraint';
import UIView from './UIView';

const Form = props => {
  if (props.type === 'UIButton') {
    return <UIButtonView {...props} />;
  } else if (props.type === 'UILabel' || props.type === 'UIButtonLabel') {
    return <UILabelView {...props} />;
  } else if (props.type === 'NSLayoutConstraint') {
    return <NSLayoutConstraint {...props} onFormChange={props.onFormChange} />;
  } else {
    return <UIView {...props} />;
  }
};

export default Form;