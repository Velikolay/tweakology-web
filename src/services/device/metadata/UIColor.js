const UIColor = {
  name: 'Color',
  type: 'UIColor',
  description: 'Stores color data and sometimes opacity (alpha value).',
};

export const BackgroundColor = {
  ...UIColor,
  init: id => ({
    alpha: 1,
    hexValue: '#ffffff',
  }),
};

export const TextColor = {
  ...UIColor,
  init: id => ({
    alpha: 1,
    hexValue: '#000000',
  }),
};
