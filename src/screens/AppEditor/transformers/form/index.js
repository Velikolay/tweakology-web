import UIView from './UIView';
import UIButton from './UIButton';
import UILabel from './UILabel';
import UIImageView from './UIImageView';
import NSLayoutConstraint from './NSLayoutConstraint';

const TRANSFORMERS = {
  UIView,
  UILabel,
  UIButton,
  UIImageView,
  NSLayoutConstraint,
};

export default name => (name in TRANSFORMERS ? TRANSFORMERS[name] : UIView);
