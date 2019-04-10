const UIFont = {
  name: 'Font',
  type: 'UIFont',
  description:
    'Provides you with access to the font’s characteristics and also provides the system with access to the font’s glyph information, which is used during layout',
  init: id => ({
    familyName: 'System',
    fontStyle: 'Regular',
    pointSize: 14,
  }),
};

export default UIFont;
