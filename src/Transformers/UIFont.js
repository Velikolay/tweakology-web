import { toFontStyles } from '../Utils/Font';

const FontTransformer = {
  fromPayload: (font, systemContext) => {
    const { fontName, pointSize } = font;
    const { system, preffered } = systemContext.fonts;

    let res = font;
    Object.entries(system).forEach(([sysFamilyName, sysFontNames]) => {
      if (sysFontNames.includes(fontName)) {
        res = { familyName: sysFamilyName, fontName, pointSize };
      }
    });
    Object.entries(preffered).forEach(([presetGroup, presetOptions]) => {
      Object.entries(presetOptions).forEach(
        ([presetName, { fontName: fn, pointSize: ps }]) => {
          if (fontName === fn && pointSize === ps) {
            res = { familyName: presetGroup, fontName: presetName, pointSize };
          }
        },
      );
    });
    return res;
  },

  toPayload: ({ familyName, fontName, pointSize }) => ({
    familyName,
    fontName,
    fontStyle: toFontStyles(fontName),
    pointSize,
  }),
};

export default FontTransformer;
