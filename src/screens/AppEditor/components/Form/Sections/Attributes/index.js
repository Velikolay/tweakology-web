import UIView from './UIView';
import UIButton from './UIButton';
import UILabel from './UILabel';
import UIImageView from './UIImageView';
import NSLayoutConstraint from './NSLayoutConstraint';

const ATTRIBUTES = {
  UIView,
  UILabel,
  UIButton,
  UIImageView,
  NSLayoutConstraint,
};

const getAttributesComponent = name =>
  name in ATTRIBUTES ? ATTRIBUTES[name] : UIView;

export default getAttributesComponent;
