import NSLayoutConstraint from './NSLayoutConstraint';
import UIButton from './UIButton';
import UILabel from './UILabel';
import UIView from './UIView';
import UIImageView from './UIImageView';

export const viewCatalogue = {
  UIView,
  UILabel,
  UIButton,
  UIImageView,
};

export const layoutCatalogue = {
  NSLayoutConstraint,
};

export const combinedCatalogue = {
  ...viewCatalogue,
  ...layoutCatalogue,
};
