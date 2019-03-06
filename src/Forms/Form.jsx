import React from 'react';
import PropTypes from 'prop-types';

import { withSystemContext } from '../Context/SystemContext';

import UIButtonView from './UIButtonView';
import UILabelView from './UILabelView';
import UIImageView from './UIImageView';
import NSLayoutConstraint from './NSLayoutConstraint';
import UIView from './UIView';

class Form extends React.PureComponent {
  render() {
    const { type } = this.props;
    if (type === 'UIButton') {
      return <UIButtonView {...this.props} />;
    }
    if (type === 'UILabel') {
      return <UILabelView {...this.props} />;
    }
    if (type === 'UIImageView') {
      return <UIImageView {...this.props} />;
    }
    if (type === 'NSLayoutConstraint') {
      return <NSLayoutConstraint {...this.props} />;
    }
    return <UIView {...this.props} />;
  }
}

Form.propTypes = {
  type: PropTypes.string.isRequired,
};

export default withSystemContext(Form);
