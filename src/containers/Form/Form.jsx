import React from 'react';
import PropTypes from 'prop-types';

import { withDeviceContext } from '../../contexts/Device/DeviceContext';

import UIViewAttributes from './Sections/Attributes/UIView/UIView';
import UIButtonViewAttributes from './Sections/Attributes/UIButtonView/UIButtonView';
import UILabelViewAttributes from './Sections/Attributes/UILabelView/UILabelView';
import UIImageViewAttributes from './Sections/Attributes/UIImageView/UIImageView';
import NSLayoutConstraintAttributes from './Sections/Attributes/NSLayoutConstraint/NSLayoutConstraint';

class Form extends React.PureComponent {
  render() {
    const { type } = this.props;
    if (type === 'UIButton') {
      return <UIButtonViewAttributes {...this.props} />;
    }
    if (type === 'UILabel') {
      return <UILabelViewAttributes {...this.props} />;
    }
    if (type === 'UIImageView') {
      return <UIImageViewAttributes {...this.props} />;
    }
    if (type === 'NSLayoutConstraint') {
      return <NSLayoutConstraintAttributes {...this.props} />;
    }
    return <UIViewAttributes {...this.props} />;
  }
}

Form.propTypes = {
  type: PropTypes.string.isRequired,
};

export default withDeviceContext(Form);
