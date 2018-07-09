const mergeEnchancers = styles => {
  const enchancers = new Set(["Extra", "Ultra", "Semi", "Demi"]);
  let enchancedStyles = [];
  let i = 0;
  while (i < styles.length) {
    if (enchancers.has(styles[i]) && i + 1 < styles.length) {
      enchancedStyles.push(styles[i] + styles[i+1]);
      i+=2;
    } else {
      enchancedStyles.push(styles[i]);
      i++;
    }
  }
  return enchancedStyles;
}

const transformFontName = fontName => {
  const familyStylePair = fontName.split('-');
  if (familyStylePair.length === 2) {
    const styles = mergeEnchancers(familyStylePair[1].split(/(?=[A-Z])/).filter(style => style.length > 1));
    return styles.join(' ');
  } else {
    return 'Regular';
  }
}

const transformFontFamily = (systemFont, fontFamily) => {
  return systemFont === fontFamily ? 'System' : fontFamily;
}

const getFontName = (fontFamily, fontStyle, styles) => {
  if (fontFamily in styles) {
    const fontNames = styles[fontFamily].filter(fontName => fontName.includes("-" + fontStyle.replace(/\s/g, "")));
    if (fontNames.length > 0) {
      return fontNames.reduce((a, b) => a.length <= b.length ? a : b);
    } else if (fontStyle == "Regular") {
      return styles[fontFamily].reduce((a, b) => a.length <= b.length ? a : b);
    }
  }
  return "";
}

const enrichFontsData = fontsData => {
  fontsData.styles = {};
  Object.keys(fontsData.names).map(key =>
    fontsData.styles[key] = fontsData.names[key].map(transformFontName)
  );
  return fontsData;
}

export { transformFontName, transformFontFamily, enrichFontsData, getFontName };
