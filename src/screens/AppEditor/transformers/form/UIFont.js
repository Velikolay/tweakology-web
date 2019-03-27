// @flow
import type { UIFont, DeviceFonts } from '../../../../services/device/types';
import withFalsyGuard from './utils';
import { toFontStyles } from '../../../../utils/font';

const UIFontTransformer = {
  fromPayload: (font: UIFont, device: { fonts: DeviceFonts }) => {
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

  toPayload: ({ trait, familyName, fontName, pointSize }: any): UIFont => ({
    trait,
    familyName,
    fontName,
    fontStyle: toFontStyles(fontName),
    pointSize,
  }),
};

export default withFalsyGuard(UIFontTransformer);
