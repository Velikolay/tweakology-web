// @flow
import type { DeviceFonts } from '../Device/Types';

const mergeEnchancers = styles => {
  const enchancers = new Set(['Extra', 'Ultra', 'Semi', 'Demi']);
  const enchancedStyles = [];
  let i = 0;
  while (i < styles.length) {
    if (enchancers.has(styles[i]) && i + 1 < styles.length) {
      enchancedStyles.push(styles[i] + styles[i + 1]);
      i += 2;
    } else {
      enchancedStyles.push(styles[i]);
      i += 1;
    }
  }
  return enchancedStyles;
};

const toFontStyles = (fontName: string): string => {
  const familyStylePair = fontName.split('-');
  if (familyStylePair.length === 2) {
    const styles = mergeEnchancers(
      familyStylePair[1].split(/(?=[A-Z])/).filter(style => style.length > 1),
    );
    return styles.join(' ');
  }
  return 'Regular';
};

const enrichFontsData = (fontsData: DeviceFonts): DeviceFonts => {
  const { system, custom, preffered } = fontsData;
  const families = [];
  families.push(...Object.keys(system).sort((a, b) => a.localeCompare(b)));
  families.push(...Object.keys(preffered).sort((a, b) => a.localeCompare(b)));
  families.push(...Object.keys(custom).sort((a, b) => a.localeCompare(b)));
  const prefferedFonts = Object.keys(preffered).reduce((map, key) => {
    map[key] = Object.keys(preffered[key]); // eslint-disable-line no-param-reassign
    return map;
  }, {});
  const all = {
    ...system,
    ...prefferedFonts,
    ...custom,
  };
  return Object.assign(fontsData, { families, all });
};

export { toFontStyles, enrichFontsData };
