import CGRect from './CGRect';
import { BackgroundColor, TextColor } from './UIColor';
import UIFont from './UIFont';

const UIButton = {
  name: 'Button',
  type: 'UIButton',
  description:
    "Intercepts touch events and sends an action message to a target object when it's tapped",
  init: id => ({
    frame: CGRect.init(id),
    properties: {
      backgroundColor: BackgroundColor.init(id),
      title: {
        text: id,
        textColor: TextColor.init(id),
        font: UIFont.init(id),
      },
    },
  }),
};

export default UIButton;
