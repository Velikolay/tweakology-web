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

const withFalsyGuard = transformerObj => ({
  fromPayload: (props, device) =>
    props ? transformerObj.fromPayload(props, device) : props,
  toPayload: (props, device) =>
    props ? transformerObj.toPayload(props, device) : props,
});

const getTransformer = name =>
  withFalsyGuard(name in TRANSFORMERS ? TRANSFORMERS[name] : UIView);

export default getTransformer;
