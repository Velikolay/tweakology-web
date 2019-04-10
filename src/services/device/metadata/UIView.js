import CGRect from './CGRect';
import { BackgroundColor } from './UIColor';

const UIView = {
  name: 'View',
  type: 'UIView',
  description:
    'Represents a rectangular region in which it draws and receives events',
  init: id => ({
    frame: CGRect.init(),
    properties: {
      backgroundColor: BackgroundColor.init(id),
    },
  }),
};

const convert = options =>
  Object.entries(options).map(([key, val]) => ({
    value: key,
    text: val,
  }));

export const ContentModeOptions = convert({
  0: 'Scale To Fill',
  1: 'Scale Aspect Fit',
  2: 'Scale Aspect Fill',
  3: 'Redraw',
  4: 'Center',
  5: 'Top',
  6: 'Bottom',
  7: 'Left',
  8: 'Right',
  9: 'Top Left',
  10: 'Top Right',
  11: 'Bottom Left',
  12: 'Bottom Right',
});

export const SemanticContentAttributeOptions = convert({
  0: 'Unspecified',
  1: 'Playback',
  2: 'Spatial',
  3: 'Force Left-To-Right',
  4: 'Force Right-To-Left',
});

export default UIView;
