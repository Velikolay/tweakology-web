import React from 'react';

import { withSystemContext } from '../Context/SystemContext';

import UIButtonView from './UIButtonView';
import UILabelView from './UILabelView';
import UIImageView from './UIImageView';
import NSLayoutConstraint from './NSLayoutConstraint';
import UIView from './UIView';

const Form = (props) => {
  const { type } = props;
  if (type === 'UIButton') {
    return <UIButtonView {...props} />;
  } if (type === 'UILabel' || type === 'UIButtonLabel') {
    return <UILabelView {...props} />;
  } if (type === 'UIImageView') {
    return <UIImageView {...props} />;
  } if (type === 'NSLayoutConstraint') {
    return <NSLayoutConstraint {...props} />;
  }
  return <UIView {...props} />;
};

export default withSystemContext(Form);
