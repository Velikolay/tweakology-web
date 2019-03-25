import UIView from './UIView';
import UIButton from './UIButton';
import UILabel from './UILabel';
import UIImageView from './UIImageView';
import Identity from './Identity';

const TRANSFORMERS = {
  UIView,
  UILabel,
  UIButton,
  UIImageView,
  NSLayoutConstraint: Identity,
};

const getTransformer = name =>
  name in TRANSFORMERS ? TRANSFORMERS[name] : UIView;

export default getTransformer;
