// @flow
import type {
  UIFont as UIFontPayload,
  DeviceFonts,
} from '../../../../services/device/types';
import type { UIFont as UIFontForm } from '../../../../containers/Form/types';

import withFalsyGuard from './utils';
import { toFontStyles } from '../../../../utils/font';

const UIFontTransformer = {
  fromPayload: (
    font: UIFontPayload,
    device: { fonts: DeviceFonts },
  ): UIFontForm => {
    const { trait, fontName, pointSize } = font;
    const { system, preffered } = device.fonts;

    for (const sysFamilyName in system) {
      if ({}.hasOwnProperty.call(system, sysFamilyName)) {
        const sysFontNames = system[sysFamilyName];
        if (sysFontNames.includes(fontName)) {
          return { trait, familyName: sysFamilyName, fontName, pointSize };
        }
      }
    }

    for (const presetGroup in preffered) {
      if ({}.hasOwnProperty.call(preffered, presetGroup)) {
        const presetOptions = preffered[presetGroup];
        for (const presetName in presetOptions) {
          if ({}.hasOwnProperty.call(presetOptions, presetName)) {
            const { fontName: fn, pointSize: ps } = presetOptions[presetName];
            if (fontName === fn && pointSize === ps) {
              return {
                trait,
                familyName: presetGroup,
                fontName: presetName,
                pointSize,
              };
            }
          }
        }
      }
    }
    return font;
  },

  toPayload: (font: UIFontForm): UIFontPayload => ({
    trait: font.trait,
    familyName: font.familyName,
    fontName: font.fontName,
    fontStyle: toFontStyles(font.fontName),
    pointSize: font.pointSize,
  }),
};

export default withFalsyGuard(UIFontTransformer);
