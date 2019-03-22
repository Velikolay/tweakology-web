import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';

import OffsetSlider from '../../components/Scene/OffsetSlider/OffsetSlider';
import TextureOnOffButton from '../../components/Scene/TextureOnOffButton/TextureOnOffButton';

import { UITreeShape, ConstraintIndicatorShape } from './Shapes';
import CoordinateTranslator from './coordinate-translator';
import SceneManager from './manager';
import SceneControls from './controls';

import './Scene.scss';

const OrbitControls = require('three-orbit-controls')(THREE);
const ResizeSensor = require('css-element-queries/src/ResizeSensor');

const INITIAL_PLANE_OFFSET = 2;

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

class SceneContainer extends Component {
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

    const { tree, constraintIndicators, eventHandler } = this.props;
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const fov = 75;
    const near = 1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, 0, near, far);
    camera.position.set(0, 0, 750);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3c3f41);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    this.coordTranslator = new CoordinateTranslator(scene);

    this.orbitControls = initOrbitControls(camera, this.renderer.domElement);
    this.sceneControls = new SceneControls(camera, this.renderer.domElement);
    this.sceneControls.addEventListener('dragstart', this.dragStart);
    this.sceneControls.addEventListener('dragend', this.dragEnd);
    this.sceneControls.addEventListener('drag', event => {
      const {
        userData: { id },
        position: coord3DScene,
      } = event.object;
      const v = this.coordTranslator.calcDeviceCoord(event.object);
      const position = new THREE.Vector3();
      position.addVectors(coord3DScene, v);
      eventHandler('drag', { id, position });
    });
    this.sceneControls.addEventListener('select', event => {
      const {
        userData: { id },
      } = event.object;
      eventHandler('select', { id });
    });
    this.sceneControls.addEventListener('hoveron', event => {
      const {
        userData: { id },
      } = event.object;
      if (this.previousHoverOnObject !== id) {
        this.previousHoverOnObject = id;
        eventHandler('hoveron', { id });
      }
    });
    this.sceneManager = new SceneManager(
      this.scene,
      this.coordTranslator,
      INITIAL_PLANE_OFFSET,
    );
    this.sceneManager.updateViews(tree);
    this.sceneManager.updateConstraintIndicators(constraintIndicators);

    this.container.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillReceiveProps(nextProps) {
    const { tree, constraintIndicators } = nextProps;
    this.sceneManager.updateViews(tree);
    this.sceneManager.updateConstraintIndicators(constraintIndicators);
    if (this.sceneControls) {
      this.sceneControls.setObjects(this.sceneManager.getMeshGroups());
    }
  }

  componentWillUnmount() {
    this.orbitControls.dispose();
    delete this.orbitControls;
    this.sceneControls.dispose();
    delete this.sceneControls;
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

  dragStart(event) {
    if (this.orbitControls) {
      this.orbitControls.enabled = false;
    }
    const { eventHandler } = this.props;
    eventHandler('dragstart');
  }

  dragEnd() {
    if (this.orbitControls) {
      this.orbitControls.enabled = true;
    }
    const { eventHandler } = this.props;
    eventHandler('dragend');
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
          className="SceneContainer"
        />
        <OffsetSlider
          initial={INITIAL_PLANE_OFFSET}
          onChange={value => this.sceneManager.updatePlaneOffset(value)}
        />
        <TextureOnOffButton
          onClick={() => this.sceneManager.flipTextureVisibility()}
        />
      </React.Fragment>
    );
  }
}

SceneContainer.propTypes = {
  tree: UITreeShape,
  constraintIndicators: PropTypes.arrayOf(ConstraintIndicatorShape),
  eventHandler: PropTypes.func,
};

SceneContainer.defaultProps = {
  tree: null,
  constraintIndicators: [],
  eventHandler: () => {},
};

export default SceneContainer;