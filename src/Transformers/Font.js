import { transformFontFamily, transformFontName, restoreFontName } from '../Utils/Font';

const FontTransformer = {

  fromPayload: ({
    familyName, fontName, pointSize,
  }, systemContext) => ({
    familyName: transformFontFamily(systemContext.fonts.systemFont, familyName),
    fontStyle: transformFontName(fontName),
    pointSize,
  }),

  toPayload: ({
    familyName, fontStyle, pointSize,
  }, systemContext) => ({
    fontName: restoreFontName(familyName, fontStyle, systemContext.fonts.names),
    familyName,
    fontStyle,
    pointSize,
  }),
};

export default FontTransformer;
