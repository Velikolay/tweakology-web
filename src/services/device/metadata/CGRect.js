const CGRect = {
  name: 'Rect',
  type: 'CGRect',
  description:
    'A structure that contains the location and dimensions of a rectangle.',
  init: id => ({
    x: 0,
    y: 0,
    height: 50,
    width: id ? id.length * 10 + 16 : 80,
  }),
};

export default CGRect;
