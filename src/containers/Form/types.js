// @flow

export type CGPoint = {
  x: number,
  y: number,
};

export type CGSize = {
  width: number,
  height: number,
};

export type CGRect = CGPoint & CGSize;

export type UIColor = {
  hexValue: string,
  alpha: number,
};

export type UIFont = {
  trait: number,
  pointSize: number,
  familyName: string,
  fontName: string,
};

export type UIView = {
  frame: CGRect,
  backgroundColor: UIColor,
  contentMode: string,
  semanticContentAttribute: string,
  isHidden?: boolean,
};

export type UILabel = UIView & {
  font: UIFont,
  textColor: UIColor,
  text: string,
  baselineAdjustment: number,
  numberOfLines: number,
  lineBreakMode: number,
  textAlignment: number,
};

export type UIButtonLabel = UILabel;

export type UIButton = UIView & {
  title: UIButtonLabel,
};

export type UIImage = {
  src: string,
};

export type UIImageView = UIView & {
  image: {
    src: string,
  },
  highlightedImage?: {
    src: string,
  },
};

export type UIScrollView = UIView & {
  contentOffset: CGPoint,
  contentSize: CGSize,
};

export type NSLayoutConstraintItemAttribute = {
  item: {
    value: string,
    placeholder: string,
  },
  attribute: {
    value: string,
    relativeToMargin?: boolean,
    respectLanguageDirection?: boolean,
  },
};

export type NSLayoutConstraint = {
  meta: {
    synced?: boolean,
    added: boolean,
  },
  first: NSLayoutConstraintItemAttribute,
  second?: NSLayoutConstraintItemAttribute,
  relation: string,
  constant: number,
  multiplier: number,
  priority: number,
  isActive: boolean,
  itemOptions?: any, // TODO: ideally should not be here
};
