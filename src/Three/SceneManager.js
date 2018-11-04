import _ from 'lodash';
import * as THREE from 'three';

const createUserData = (id, object) => ({
  id,
  drag: {
    displacement: new THREE.Vector3(0, 0, 0),
    prevPosition: new THREE.Vector3().copy(object.position),
  },
});

const createMesh = (props) => {
  const {
    id, width, height, imgUrl,
  } = props;
  const img = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(imgUrl),
    side: THREE.DoubleSide,
    transparent: true,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
  });
  // img.map.needsUpdate = true;
  img.map.minFilter = THREE.LinearFilter;

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = img;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = createUserData(id, mesh);
  return mesh;
};

const createOverLayMesh = (props) => {
  const {
    id, width, height,
  } = props;
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00bfff,
    side: THREE.DoubleSide,
    opacity: 0.35,
    transparent: true,
  });
  const overlayMesh = new THREE.Mesh(geometry, material);
  overlayMesh.userData = createUserData(id, overlayMesh);
  return overlayMesh;
};

const createLineSegments = (props) => {
  const {
    id, width, height, selected, onFocus,
  } = props;

  let wireframeColor = 0x666666;
  if (selected) {
    wireframeColor = 0x2566c6;
  } else if (onFocus) {
    wireframeColor = 0xcccccc;
  }

  const geometry = new THREE.PlaneGeometry(width, height);
  const wGeometry = new THREE.EdgesGeometry(geometry);
  const wMaterial = new THREE.LineBasicMaterial({
    color: wireframeColor,
    linewidth: 1,
  });

  const lineSegments = new THREE.LineSegments(wGeometry, wMaterial);
  lineSegments.userData = createUserData(id, lineSegments);
  return lineSegments;
};

class SceneManager {
  constructor(scene, planeOffset) {
    this.scene = scene;
    this.planeOffset = planeOffset;
    this.viewsMap = {};
    this.constraintIndicatorsMap = {};
    this.showTexture = true;
  }

  getSelectedMeshGroups() {
    return Object.entries(this.viewsMap)
      .filter(([id, { viewProps: { selected } }]) => selected)
      .map(([id, { meshGroup }]) => meshGroup);
  }

  updatePlaneOffset(planeOffset) {
    this.planeOffset = planeOffset;
    Object.values(this.viewsMap).forEach(({ meshGroup: { children }, viewProps: { x, y, z } }) => (
      children.forEach(el => el.position.set(x, y, z * this.planeOffset))
    ));
    Object.values(this.constraintIndicatorsMap).forEach(
      ({ lineGroup: { children }, indicatorProps }) => (
        indicatorProps.lineGroup.forEach(({ z1, z2 }, idx) => {
          const line = children[idx];
          line.geometry.vertices[0].z = z1 * this.planeOffset + 1;
          line.geometry.vertices[1].z = z2 * this.planeOffset + 1;
          line.geometry.verticesNeedUpdate = true;
        })
      ),
    );
  }

  flipTextureVisibility() {
    this.showTexture = !this.showTexture;
    Object.values(this.viewsMap).forEach(({ meshGroup: { children: [textureMesh] } }) => {
      // eslint-disable-next-line no-param-reassign
      textureMesh.visible = this.showTexture;
    });
  }

  updateViews(views) {
    for (const nextViewProps of views) {
      if (nextViewProps.id in this.viewsMap) {
        const { meshGroup, viewProps } = this.viewsMap[nextViewProps.id];
        if (!_.isEqual(viewProps, nextViewProps)) {
          this.updateView(meshGroup, viewProps, nextViewProps);
          this.viewsMap[nextViewProps.id].viewProps = nextViewProps;
        }
      } else {
        const meshGroup = this.createView(nextViewProps);
        const { children: [textureMesh] } = meshGroup;
        textureMesh.visible = this.showTexture;
        this.viewsMap[nextViewProps.id] = { meshGroup, viewProps: nextViewProps };
        this.scene.add(meshGroup);
      }
    }
  }

  updateConstraintIndicators(indicators) {
    for (const id in this.constraintIndicatorsMap) {
      if (Object.prototype.hasOwnProperty.call(this.constraintIndicatorsMap, id)) {
        const { lineGroup } = this.constraintIndicatorsMap[id];
        this.scene.remove(lineGroup);
        delete this.constraintIndicatorsMap[id];
      }
    }

    for (const nextIndicatorProps of indicators) {
      const lineGroup = this.createConstraintIndicator(nextIndicatorProps.lineGroup);
      this.constraintIndicatorsMap[nextIndicatorProps.id] = {
        lineGroup,
        indicatorProps: nextIndicatorProps,
      };
      this.scene.add(lineGroup);
    }
  }

  createView(viewProps) {
    const {
      id, x, y, z, selected,
    } = viewProps;
    const mesh = createMesh(viewProps);
    const lineSegments = createLineSegments(viewProps);

    const meshGroup = new THREE.Group();
    meshGroup.add(mesh);
    meshGroup.add(lineSegments);

    if (selected) {
      const overlayMesh = createOverLayMesh(viewProps);
      meshGroup.add(overlayMesh);
    }
    meshGroup.userData = createUserData(id, mesh);
    meshGroup.position.set(x, y, z * this.planeOffset);
    return meshGroup;
  }

  updateView(group, viewProps, nextViewProps) {
    const {
      x, y, z, width, height, selected, onFocus, imgUrl, revision,
    } = nextViewProps;

    group.position.set(x, y, z * this.planeOffset);
    for (const el of group.children) {
      if (viewProps.width) {
        el.scale.x *= width / viewProps.width;
      } else {
        el.scale.x += width;
      }

      if (viewProps.height) {
        el.scale.y *= height / viewProps.height;
      } else {
        el.scale.y += height;
      }
    }

    if (imgUrl !== viewProps.imgUrl || revision !== viewProps.revision) {
      // eslint-disable-next-line no-param-reassign
      group.children[0].material.map = new THREE.TextureLoader().load(imgUrl);
    }

    let wireframeColor = 0x666666;
    if (selected) {
      wireframeColor = 0x2566c6;
    } else if (onFocus) {
      wireframeColor = 0xcccccc;
    }
    group.children[1].material.color.setHex(wireframeColor);

    if (selected) {
      if (group.children.length < 3) {
        const overlayMesh = createOverLayMesh(nextViewProps);
        group.add(overlayMesh);
      }
    } else if (group.children.length === 3) {
      group.remove(group.children[2]);
    }
  }

  createConstraintIndicator(constraintIndicatorProps) {
    const lineGroup = new THREE.Group();
    for (const indicator of constraintIndicatorProps) {
      lineGroup.add(this.createLine(indicator));
    }
    return lineGroup;
  }

  createLine(props) {
    const {
      x1, y1, z1,
      x2, y2, z2,
    } = props;

    const p1 = new THREE.Vector3(x1, y1, z1 * this.planeOffset + 1);
    const p2 = new THREE.Vector3(x2, y2, z2 * this.planeOffset + 1);

    const matertial = new THREE.LineBasicMaterial({ color: 0xc89637, linewidth: 2 });
    const geometry = new THREE.Geometry();
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);

    return new THREE.Line(geometry, matertial);
  }
}

export default SceneManager;
