import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);
const ResizeSensor = require('css-element-queries/src/ResizeSensor');

const getTHREEMesh = (view) => {
  const {
    x, y, z, width, height, selected, onFocus, imgUrl,
  } = view;
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

  const selectOverlay = new THREE.MeshBasicMaterial({
    color: 0x00bfff,
    side: THREE.DoubleSide,
    opacity: 0.35,
    transparent: true,
  });

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = img;

  let wireframeColor = 0x666666;
  if (selected) {
    wireframeColor = 0x2566c6;
  } else if (onFocus) {
    wireframeColor = 0xcccccc;
  }

  const wGeometry = new THREE.EdgesGeometry(geometry);
  const wMaterial = new THREE.LineBasicMaterial({
    color: wireframeColor,
    linewidth: 1,
  });

  const lineSegments = new THREE.LineSegments(wGeometry, wMaterial);
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z * 5);
  mesh.add(lineSegments);
  if (selected) {
    const overlayMesh = new THREE.Mesh(geometry, selectOverlay);
    mesh.add(overlayMesh);
  }
  return mesh;
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
  return console;
};

class ThreeScene extends Component {
  constructor(props) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.sceneResizeSensor = new ResizeSensor(this.container, (() => {
      self.updateCanvasDimensions();
    }));

    const { views } = this.props;
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const fov = 75;
    const near = 1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, 0, near, far);
    camera.position.set(0, 0, 750);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282841);

    for (const view of views) {
      scene.add(getTHREEMesh(view));
    }

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = initOrbitControls(camera, this.renderer.domElement);

    this.container.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillReceiveProps(nextProps) {
    const { views } = this.props;
    if (views.length === 0) {
      for (const meshProps of nextProps.views) {
        const threeMesh = getTHREEMesh(meshProps);
        this.scene.add(threeMesh);
      }
    }
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
      this.renderer.setSize(offsetWidth, offsetHeight);
      this.camera.aspect = offsetWidth / offsetHeight;
      this.camera.updateProjectionMatrix();
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
    this.renderScene();
    this.frameId = requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div ref={(el) => { this.container = el; }} className="scene-view-container" />
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
};

export default ThreeScene;
