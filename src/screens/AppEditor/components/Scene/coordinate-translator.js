const CoordinateTranslator = {
  calcScenePoint: ({ x, y, z }, parent) => {
    const {
      userData: { width: parentWidth, height: parentHeight },
    } = parent;
    return {
      x: x - parentWidth / 2,
      y: -(y - parentHeight / 2),
      z,
    };
  },

  calcSceneRect: obj => {
    const {
      userData: viewProps,
      position: { x, y, z },
      parent,
    } = obj;
    const { width, height } = viewProps;
    const {
      userData: { width: parentWidth, height: parentHeight },
    } = parent;
    return {
      x: x - (parentWidth - width) / 2,
      y: (parentHeight - height) / 2 - y,
      z,
    };
  },

  calcDeviceRect: obj => {
    const {
      userData: viewProps,
      parent,
      position: { x, y, z },
    } = obj;
    const { width, height } = viewProps;
    const {
      userData: { width: parentWidth, height: parentHeight },
    } = parent;
    return {
      x: x + (parentWidth - width) / 2,
      y: (parentHeight - height) / 2 - y,
      z,
    };
  },
};

export default CoordinateTranslator;
