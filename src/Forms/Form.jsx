import React from 'react';
import PropTypes from 'prop-types';

import { withSystemContext } from '../Context/SystemContext';

import UIButtonView from './UIButtonView';
import UILabelView from './UILabelView';
import UIImageView from './UIImageView';
import NSLayoutConstraint from './NSLayoutConstraint';
import UIView from './UIView';

const Form = props => {
  const { type } = props;
  if (type === 'UIButton') {
    return <UIButtonView {...props} />;
  }
  if (type === 'UILabel') {
    return <UILabelView {...props} />;
  }
  if (type === 'UIImageView') {
    return <UIImageView {...props} />;
  }
  if (type === 'NSLayoutConstraint') {
    return <NSLayoutConstraint {...props} />;
  }
  return <UIView {...props} />;
};

Form.propTypes = {
  type: PropTypes.string.isRequired,
};

export default withSystemContext(Form);
