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
  fontStyle?: string,
};

export type UIImage = {
  src: string,
};

export type UIView = {
  frame: CGRect,
  backgroundColor: UIColor,
  contentMode: number,
  semanticContentAttribute: number,
  isHidden?: boolean,
};

export type UIControl = UIView & {
  eventHandlers: string[],
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

export type UIButton = UIControl & {
  title: UIButtonLabel,
};

export type UIImageView = UIView & {
  image: UIImage,
  highlightedImage?: UIImage,
};

export type UIScrollView = UIView & {
  contentOffset: CGPoint,
  contentSize: CGSize,
};

export type AnyUIView =
  | UIView
  | UILabel
  | UIButton
  | UIImageView
  | UIScrollView;

export type NSLayoutConstraintAttributeItem = {
  item: string,
  attribute: number,
};

export type NSLayoutConstraint = {
  meta: {
    synced?: boolean,
    added: boolean,
  },
  first: NSLayoutConstraintAttributeItem,
  second?: NSLayoutConstraintAttributeItem,
  relation: number,
  constant: number,
  multiplier: number,
  priority: number,
  isActive: boolean,
  itemOptions?: any, // TODO: ideally should not be here
};

export type UIViewNode<T: AnyUIView> = {
  uid: {
    value: string,
    kind: number,
  },
  name: string,
  type: string,
  properties: T,
  constraints: NSLayoutConstraint[],
  subviews: UIViewNode<T>[],
};

export type DeviceUITreeData = UIViewNode<AnyUIView>;

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

export type DeviceEvents = {
  [eventType: string]: number,
};

export type DeviceSystemData = {
  fonts: DeviceFonts,
  events: DeviceEvents,
};

export type ActionsData = { [action_id: string]: any };
export type EventHandlersData = { [event_id: string]: any };
export type AttributesData = { [attr_name: string]: any };

export type DeviceRuntimeData = {
  actions: ActionsData,
  eventHandlers: EventHandlersData,
  attributes: AttributesData,
};
