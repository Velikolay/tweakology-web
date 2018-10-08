import IdentityTransformer from './Identity';
import UIButtonTransformer from './UIButton';
import UILabelTransformer from './UILabel';
import ConstraintTransformer from './Constraint';

const TRANSFORMERS = {
  UILabel: UILabelTransformer,
  UIButton: UIButtonTransformer,
  NSLayoutConstraint: ConstraintTransformer,
};

const getTransformer = name => (name in TRANSFORMERS ? TRANSFORMERS[name] : IdentityTransformer);

export default getTransformer;
