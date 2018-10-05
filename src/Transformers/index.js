import UIButtonTransformer from './UIButton';
import UILabelTransformer from './UILabel';
import ConstraintTransformer from './Constraint';

const DefaultTransformer = {
  fromPayload: props => props,
  toPayload: props => props,
};

const TRANSFORMERS = {
  UILabel: UILabelTransformer,
  UIButton: UIButtonTransformer,
  NSLayoutConstraint: ConstraintTransformer,
};

const getTransformer = name => (name in TRANSFORMERS ? TRANSFORMERS[name] : DefaultTransformer);

export default getTransformer;
