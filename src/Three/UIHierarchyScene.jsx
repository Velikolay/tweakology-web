import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { IconContext } from 'react-icons';
import { FaClone } from 'react-icons/fa';
import Slider from 'rc-slider';

import CoordinateTranslator from './CoordinateTranslator';
import SceneManager from './SceneManager';

import 'rc-slider/assets/index.css';
import './UIHierarchyScene.css';
import DragControls from './Controls/DragControls';

const OrbitControls = require('three-orbit-controls')(THREE);
const ResizeSensor = require('css-element-queries/src/ResizeSensor');

const DEFAULT_PLANE_OFFSET = 2;

const initOrbitControls = (camera, constainer) => {
  const controls = new OrbitControls(camera, constainer);
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;

  controls.minAzimuthAngle = -Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 2;

  controls.minDistance = 20;
  controls.maxDistance = 1200;

  controls.enableKeys = false;
  // controls.enablePan = false;
  return controls;
};

class UIHierarchyScene extends Component {
  constructor(props) {
    super(props);
    this.cameraPosition = new THREE.Vector3();

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.sceneResizeSensor = new ResizeSensor(this.container, () => {
      self.updateCanvasDimensions();
    });

    const { views, constraintIndicators, onDragHandler } = this.props;
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

    this.coordTranslator = new CoordinateTranslator(scene);

    this.orbitControls = initOrbitControls(camera, this.renderer.domElement);
    this.dragControls = new DragControls(camera, this.renderer.domElement);
    this.dragControls.addEventListener('dragstart', this.dragStart);
    this.dragControls.addEventListener('dragend', this.dragEnd);
    this.dragControls.addEventListener('drag', event => {
      const {
        userData: { id },
        position: coord3D,
      } = event.object;
      const v = this.coordTranslator.calcDeviceCoord(event.object);
      const position = new THREE.Vector3();
      position.addVectors(coord3D, v);
      onDragHandler('drag', { id, position });
    });

    this.sceneManager = new SceneManager(
      this.scene,
      this.coordTranslator,
      DEFAULT_PLANE_OFFSET,
    );
    this.sceneManager.updateViews(views);
    this.sceneManager.updateConstraintIndicators(constraintIndicators);

    this.container.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillReceiveProps(nextProps) {
    const { views, constraintIndicators } = nextProps;
    this.sceneManager.updateViews(views);
    this.sceneManager.updateConstraintIndicators(constraintIndicators);
    if (this.dragControls) {
      this.dragControls.setDraggableObjects(
        this.sceneManager.getSelectedMeshGroups(),
      );
    }
  }

  componentWillUnmount() {
    this.orbitControls.dispose();
    delete this.orbitControls;
    this.dragControls.dispose();
    delete this.dragControls;
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

  dragStart() {
    if (this.orbitControls) {
      this.orbitControls.enabled = false;
    }
    const { onDragHandler } = this.props;
    onDragHandler('dragstart');
  }

  dragEnd() {
    if (this.orbitControls) {
      this.orbitControls.enabled = true;
    }
    const { onDragHandler } = this.props;
    onDragHandler('dragend');
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
      <React.Fragment>
        <div
          ref={el => {
            this.container = el;
          }}
          className="three-scene-container"
        />
        <Slider
          min={1}
          max={25}
          className="plane-offset-slider"
          defaultValue={DEFAULT_PLANE_OFFSET}
          trackStyle={{ backgroundColor: '#c89637', height: 5 }}
          handleStyle={{
            borderColor: '#c89637',
            borderWidth: 2,
            height: 14,
            width: 14,
            marginTop: -5,
            backgroundColor: '#e0e0e0',
          }}
          railStyle={{ backgroundColor: '#e0e0e0', height: 5 }}
          onChange={planeOffset =>
            this.sceneManager.updatePlaneOffset(planeOffset)
          }
        />
        <button
          className="texture-visibility-button"
          type="button"
          onClick={() => this.sceneManager.flipTextureVisibility()}
        >
          <IconContext.Provider
            value={{ className: 'texture-visibility-icon' }}
          >
            <FaClone />
          </IconContext.Provider>
        </button>
      </React.Fragment>
    );
  }
}

UIHierarchyScene.propTypes = {
  views: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      z: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      selected: PropTypes.bool.isRequired,
      onFocus: PropTypes.bool.isRequired,
      imgUrl: PropTypes.string.isRequired,
    }),
  ).isRequired,
  constraintIndicators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      lineGroup: PropTypes.arrayOf(
        PropTypes.shape({
          x1: PropTypes.number.isRequired,
          y1: PropTypes.number.isRequired,
          z1: PropTypes.number.isRequired,
          x2: PropTypes.number.isRequired,
          y2: PropTypes.number.isRequired,
          z2: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onDragHandler: PropTypes.func,
};

export default UIHierarchyScene;
