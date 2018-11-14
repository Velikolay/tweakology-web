import IdentityTransformer from './Identity';
import UIViewTransformer from './UIView';
import UIButtonTransformer from './UIButton';
import UILabelTransformer from './UILabel';
import UIImageViewTransformer from './UIImageView';
import ConstraintTransformer from './Constraint';

const TRANSFORMERS = {
  UIView: UIViewTransformer,
  UILabel: UILabelTransformer,
  UIButton: UIButtonTransformer,
  UIImageView: UIImageViewTransformer,
  NSLayoutConstraint: ConstraintTransformer,
};

const getTransformer = name =>
  name in TRANSFORMERS ? TRANSFORMERS[name] : IdentityTransformer;

export default getTransformer;
