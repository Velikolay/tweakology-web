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

export { transformFontName, transformFontFamily };
