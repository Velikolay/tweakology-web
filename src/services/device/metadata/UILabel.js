import CGRect from './CGRect';
import { BackgroundColor, TextColor } from './UIColor';
import UIFont from './UIFont';

const UILabel = {
  name: 'Label',
  type: 'UILabel',
  description: 'A variably sized amount of static text',
  init: id => ({
    frame: CGRect.init(id),
    properties: {
      text: id,
      textColor: TextColor.init(id),
      textAlignment: 1,
      font: UIFont.init(id),
      backgroundColor: BackgroundColor.init(id),
    },
  }),
};

const convert = options =>
  Object.entries(options).map(([key, val]) => ({
    value: key,
    text: val,
  }));

export const LineBreakModeOptions = convert({
  0: 'Word Wrap',
  1: 'Character Wrap',
  2: 'Clip',
  3: 'Truncate Head',
  4: 'Truncate Middle',
  5: 'Truncate Tail',
});

export const BaselineOptions = convert({
  0: 'Align Baselines',
  1: 'Align Centers',
  2: 'None',
});

export default UILabel;
