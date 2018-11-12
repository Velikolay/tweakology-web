import * as THREE from 'three';

class CoordinateTranslator {
  constructor(scene) {
    this.scene = scene;
  }

  calc3DCoord(obj) {
    const { userData: viewProps, parent } = obj;
    const v = new THREE.Vector3();
    if (parent !== this.scene) {
      const { y, width, height } = viewProps;
      const {
        userData: { width: parentWidth, height: parentHeight },
      } = parent;
      v.set(-(parentWidth - width) / 2, (parentHeight - height) / 2 - 2 * y, 0);
    }
    return v;
  }

  calcDeviceCoord(obj) {
    const {
      userData: viewProps,
      parent,
      position: { y },
    } = obj;
    const v = new THREE.Vector3();
    if (parent !== this.scene) {
      const { width, height } = viewProps;
      const {
        userData: { width: parentWidth, height: parentHeight },
      } = parent;
      v.set((parentWidth - width) / 2, (parentHeight - height) / 2 - 2 * y, 0);
    }
    return v;
  }
}

export default CoordinateTranslator;
