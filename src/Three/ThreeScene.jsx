import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import './ThreeScene.css';

const OrbitControls = require('three-orbit-controls')(THREE);
const ResizeSensor = require('css-element-queries/src/ResizeSensor');

const createMesh = (props) => {
  const {
    x, y, z, width, height, imgUrl,
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
  mesh.position.set(x, y, z * 5);
  return mesh;
};

const createOverLayMesh = (props) => {
  const {
    x, y, z, width, height,
  } = props;
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00bfff,
    side: THREE.DoubleSide,
    opacity: 0.35,
    transparent: true,
  });
  const overlayMesh = new THREE.Mesh(geometry, material);
  overlayMesh.position.set(x, y, z * 5);
  return overlayMesh;
};

const createLineSegments = (props) => {
  const {
    x, y, z, width, height, selected, onFocus,
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
  lineSegments.position.set(x, y, z * 5);
  return lineSegments;
};

const createTHREEMesh = (viewProps) => {
  const { selected } = viewProps;
  const mesh = createMesh(viewProps);
  const lineSegments = createLineSegments(viewProps);

  const meshGroup = new THREE.Group();
  meshGroup.add(mesh);
  meshGroup.add(lineSegments);

  if (selected) {
    const overlayMesh = createOverLayMesh(viewProps);
    meshGroup.add(overlayMesh);
  }
  return meshGroup;
};

const updateTHREEMesh = (group, viewProps, nextViewProps) => {
  const {
    x, y, z, width, height, selected, onFocus, imgUrl,
  } = nextViewProps;

  const widthScale = width / viewProps.width;
  const heightScale = height / viewProps.height;

  for (const el of group.children) {
    el.position.set(x, y, z * 5);
    el.scale.x *= widthScale;
    el.scale.y *= heightScale;
  }

  if (imgUrl !== viewProps.imgUrl) {
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
};

const createLine = (props) => {
  const {
    x1, y1, z1,
    x2, y2, z2,
  } = props;

  const p1 = new THREE.Vector3(x1, y1, z1 * 5 + 1);
  const p2 = new THREE.Vector3(x2, y2, z2 * 5 + 1);

  const matertial = new THREE.LineBasicMaterial({ color: 0xc89637, linewidth: 2 });
  const geometry = new THREE.Geometry();
  geometry.vertices.push(p1);
  geometry.vertices.push(p2);

  return new THREE.Line(geometry, matertial);
};

const createConstraintIndicator = (constraintIndicatorProps) => {
  const lineGroup = new THREE.Group();
  for (const indicator of constraintIndicatorProps) {
    lineGroup.add(createLine(indicator));
  }
  return lineGroup;
};


const initOrbitControls = (camera, constainer) => {
  const controls = new OrbitControls(camera, constainer);
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;

  controls.minDistance = 20;
  controls.maxDistance = 1200;

  // controls.enablePan = false;
  return controls;
};

class SceneManager {
  constructor(scene) {
    this.scene = scene;
    this.viewsMap = {};
    this.constraintIndicatorsMap = {};
  }

  updateViews(views) {
    for (const nextViewProps of views) {
      if (nextViewProps.id in this.viewsMap) {
        const { meshGroup, viewProps } = this.viewsMap[nextViewProps.id];
        if (!_.isEqual(viewProps, nextViewProps)) {
          updateTHREEMesh(meshGroup, viewProps, nextViewProps);
          this.viewsMap[nextViewProps.id].viewProps = nextViewProps;
        }
      } else {
        const meshGroup = createTHREEMesh(nextViewProps);
        this.viewsMap[nextViewProps.id] = { meshGroup, viewProps: nextViewProps };
        this.scene.add(meshGroup);
      }
    }
  }

  updateConstraintIndicators(indicators) {
    for (const nextIndicatorProps of indicators) {
      if (!(nextIndicatorProps.id in this.constraintIndicatorsMap)) {
        const lineGroup = createConstraintIndicator(nextIndicatorProps.lineGroup);
        this.constraintIndicatorsMap[nextIndicatorProps.id] = {
          lineGroup,
          indicatorProps: nextIndicatorProps,
        };
        this.scene.add(lineGroup);
      }
    }
    const indicatorIds = indicators.map(i => i.id);
    const remIds = Object.keys(this.constraintIndicatorsMap).filter(
      id => indicatorIds.indexOf(id) === -1,
    );
    for (const remId of remIds) {
      const { lineGroup } = this.constraintIndicatorsMap[remId];
      this.scene.remove(lineGroup);
    }
  }
}

class ThreeScene extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.sceneResizeSensor = new ResizeSensor(this.container, (() => {
      self.updateCanvasDimensions();
    }));

    const { views, constraintIndicators } = this.props;
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const fov = 75;
    const near = 1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, 0, near, far);
    camera.position.set(0, 0, 750);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282841);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = initOrbitControls(camera, this.renderer.domElement);

    this.sceneManager = new SceneManager(this.scene);
    this.sceneManager.updateViews(views);
    this.sceneManager.updateConstraintIndicators(constraintIndicators);

    this.container.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillReceiveProps(nextProps) {
    const { views, constraintIndicators } = nextProps;
    this.sceneManager.updateViews(views);
    this.sceneManager.updateConstraintIndicators(constraintIndicators);
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
    this.sceneResizeSensor.detach();
    this.stop();
    this.container.removeChild(this.renderer.domElement);
  }

  updateCanvasDimensions() {
    if (this.container) {
      const { offsetWidth, offsetHeight } = this.container;
      this.camera.aspect = offsetWidth / offsetHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(offsetWidth, offsetHeight);
      this.renderer.render(this.scene, this.camera);
    } else {
      console.log('No container for scene view');
    }
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate);
  }

  render() {
    return (
      <div ref={(el) => { this.container = el; }} className="three-scene-container" />
    );
  }
}

ThreeScene.propTypes = {
  views: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onFocus: PropTypes.bool.isRequired,
    imgUrl: PropTypes.string.isRequired,
  })).isRequired,
  constraintIndicators: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    lineGroup: PropTypes.arrayOf(PropTypes.shape({
      x1: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      z1: PropTypes.number.isRequired,
      x2: PropTypes.number.isRequired,
      y2: PropTypes.number.isRequired,
      z2: PropTypes.number.isRequired,
    })).isRequired,
  })).isRequired,
};

export default ThreeScene;
