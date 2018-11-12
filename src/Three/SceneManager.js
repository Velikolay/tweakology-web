/* eslint no-underscore-dangle: 0 */
import _ from 'lodash';
import * as THREE from 'three';

const _createMesh = props => {
  const { width, height, imgUrl } = props;
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
  return mesh;
};

const _createOverLayMesh = props => {
  const { width, height } = props;
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00bfff,
    side: THREE.DoubleSide,
    opacity: 0.35,
    transparent: true,
  });
  const overlayMesh = new THREE.Mesh(geometry, material);
  return overlayMesh;
};

const _createLineSegments = props => {
  const { width, height, selected, onFocus } = props;

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
  return lineSegments;
};

const _updateView = (group, viewProps, nextViewProps) => {
  const { width, height, selected, onFocus, imgUrl, revision } = nextViewProps;

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
      const overlayMesh = _createOverLayMesh(nextViewProps);
      group.add(overlayMesh);
    }
  } else if (group.children.length === 3) {
    group.remove(group.children[2]);
  }
};

class SceneManager {
  constructor(scene, coordTranslator, planeOffset) {
    this.scene = scene;
    this.coordTranslator = coordTranslator;
    this.planeOffset = planeOffset;
    this.viewsMap = {};
    this.constraintIndicatorsMap = {};
    this.showTexture = true;
  }

  getSelectedMeshGroups() {
    return Object.values(this.viewsMap)
      .filter(({ userData: { selected } }) => selected)
      .map(({ children: [meshGroup] }) => meshGroup);
  }

  flipTextureVisibility() {
    this.showTexture = !this.showTexture;
    Object.values(this.viewsMap).forEach(nodeGroup => {
      const [meshGroup] = nodeGroup.children;
      const [textureMesh] = meshGroup.children;
      // eslint-disable-next-line no-param-reassign
      textureMesh.visible = this.showTexture;
    });
  }

  updatePlaneOffset(planeOffset) {
    this.planeOffset = planeOffset;
    Object.values(this.viewsMap).forEach(meshGroup => {
      const {
        userData: { z },
      } = meshGroup;
      meshGroup.position.setZ(z * this.planeOffset);
    });
    Object.values(this.constraintIndicatorsMap).forEach(
      ({ lineGroup: { children }, indicatorProps }) =>
        indicatorProps.lineGroup.forEach(({ z1, z2 }, idx) => {
          const line = children[idx];
          line.geometry.vertices[0].z = z1 * this.planeOffset + 1;
          line.geometry.vertices[1].z = z2 * this.planeOffset + 1;
          line.geometry.verticesNeedUpdate = true;
        }),
    );
  }

  updateConstraintIndicators(indicators) {
    for (const id in this.constraintIndicatorsMap) {
      if (
        Object.prototype.hasOwnProperty.call(this.constraintIndicatorsMap, id)
      ) {
        const { lineGroup } = this.constraintIndicatorsMap[id];
        this.scene.remove(lineGroup);
        delete this.constraintIndicatorsMap[id];
      }
    }

    for (const nextIndicatorProps of indicators) {
      const lineGroup = this._createConstraintIndicator(
        nextIndicatorProps.lineGroup,
      );
      this.constraintIndicatorsMap[nextIndicatorProps.id] = {
        lineGroup,
        indicatorProps: nextIndicatorProps,
      };
      this.scene.add(lineGroup);
    }
  }

  updateViews(treeNode) {
    this._updateViews(treeNode, this.scene);
  }

  _updateViews(treeNode, parent3DObject) {
    if (treeNode) {
      const { children: subtrees, ...nextViewProps } = treeNode;
      if (treeNode.id in this.viewsMap) {
        const nodeGroup = this.viewsMap[treeNode.id];
        const { userData: viewProps } = nodeGroup;
        if (!_.isEqual(viewProps, nextViewProps)) {
          this._updateViewNode(nodeGroup, viewProps, nextViewProps);
          this._translate3DObject(nodeGroup);
          this.viewsMap[nextViewProps.id].viewProps = nextViewProps;
        }
        subtrees.forEach(childTreeNode =>
          this._updateViews(childTreeNode, nodeGroup),
        );
      } else {
        const nodeGroup = this._createViewNode(nextViewProps);
        parent3DObject.add(nodeGroup);
        this._translate3DObject(nodeGroup);
        this.viewsMap[nextViewProps.id] = nodeGroup;
        subtrees.forEach(childTreeNode =>
          this._updateViews(childTreeNode, nodeGroup),
        );
      }
    }
  }

  _translate3DObject(obj) {
    const { x: translateX, y: translateY } = this.coordTranslator.calc3DCoord(
      obj,
    );
    obj.translateX(translateX);
    obj.translateY(translateY);
  }

  _createViewNode(viewProps) {
    const { x, y, z } = viewProps;
    const nodeGroup = new THREE.Group();
    nodeGroup.userData = viewProps;

    const meshGroup = this._createView(viewProps);
    nodeGroup.add(meshGroup);

    nodeGroup.position.set(x, y, z * this.planeOffset);
    return nodeGroup;
  }

  _createView(viewProps) {
    const { selected } = viewProps;
    const meshGroup = new THREE.Group();

    const mesh = _createMesh(viewProps);
    mesh.visible = this.showTexture;
    meshGroup.add(mesh);

    const lineSegments = _createLineSegments(viewProps);
    meshGroup.add(lineSegments);

    if (selected) {
      const overlayMesh = _createOverLayMesh(viewProps);
      meshGroup.add(overlayMesh);
    }

    return meshGroup;
  }

  _updateViewNode(nodeGroup, viewProps, nextViewProps) {
    const { x, y, z } = nextViewProps;
    nodeGroup.position.set(x, y, z * this.planeOffset);
    const [meshGroup] = nodeGroup.children;
    _updateView(meshGroup, viewProps, nextViewProps);
    // eslint-disable-next-line no-param-reassign
    nodeGroup.userData = nextViewProps;
  }

  _createConstraintIndicator(constraintIndicatorProps) {
    const lineGroup = new THREE.Group();
    for (const indicator of constraintIndicatorProps) {
      lineGroup.add(this._createLine(indicator));
    }
    return lineGroup;
  }

  _createLine(props) {
    const { x1, y1, z1, x2, y2, z2 } = props;

    const p1 = new THREE.Vector3(x1, y1, z1 * this.planeOffset + 1);
    const p2 = new THREE.Vector3(x2, y2, z2 * this.planeOffset + 1);

    const matertial = new THREE.LineBasicMaterial({
      color: 0xc89637,
      linewidth: 2,
    });
    const geometry = new THREE.Geometry();
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);

    return new THREE.Line(geometry, matertial);
  }
}

export default SceneManager;
