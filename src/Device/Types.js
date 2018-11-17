// @flow

export type CGRect = {
  x: number,
  y: number,
  width: number,
  height: number,
};

export type UIColor = {
  hexValue: string,
  alpha: number,
};

export type UIView = {
  frame: CGRect,
  backgroundColor: UIColor,
  contentMode: number,
  semanticContentAttribute: number,
};

export type UIFont = {
  trait: number,
  pointSize: number,
  familyName: string,
  fontName: string,
};

export type UIImage = {
  src: string,
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

export type UIImageView = UIView & {
  image: {
    src: string,
  },
  highlightedImage?: {
    src: string,
  },
};

export type AnyUIView = UIView | UILabel | UIButton | UIImageView;

export type NSLayoutConstraint = {
  meta: {
    synced?: boolean,
    added: boolean,
  },
  first: {
    attribute: number,
    item: string,
  },
  second?: {
    attribute: number,
    item: string,
  },
  relation: number,
  constant: number,
  multiplier: number,
  priority: number,
  isActive: boolean,
};

export type UIViewNode<T: AnyUIView> = {
  uid: {
    value: string,
    kind: number,
  },
  properties: T,
  hierarchyMetadata: string,
  constraints: NSLayoutConstraint[],
  subviews: UIViewNode<T>[],
};

export type UITree = UIViewNode<AnyUIView>;

export type DeviceFonts = {
  families?: string[],
  all?: { [fontFamily: string]: string[] },
  system: { [fontFamily: string]: string[] },
  custom: { [fontFamily: string]: string[] },
  preffered: {
    [presetGroup: string]: {
      [presetOption: string]: {
        fontName: string,
        pointSize: number,
      },
    },
  },
};

export type DeviceSystemData = {
  fonts: DeviceFonts,
};
