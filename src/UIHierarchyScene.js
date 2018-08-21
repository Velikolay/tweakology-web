import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Renderer, Scene, PerspectiveCamera } from 'react-three';

import UIHierarchySceneFooter from './UIHierarchySceneFooter.js';

const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);
const ResizeSensor = require('css-element-queries/src/ResizeSensor');

class UIHierarchyScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderer: {},
    };

    this.updateCanvasDimensions = this.updateCanvasDimensions.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.sceneResizeSensor = new ResizeSensor(self.refs.sceneContainer, (() => {
      self.updateCanvasDimensions();
    }));

    const controls = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.renderer));
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;

    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;

    controls.minDistance = 20;
    controls.maxDistance = 1200;

    // controls.enablePan = false;
    this.controls = controls;
  }

  componentWillUnmount() {
    this.sceneResizeSensor.detach();
    this.controls.dispose();
    delete this.controls;
  }

  updateCanvasDimensions() {
    const container = this.refs.sceneContainer;
    if (container) {
      this.setState({
        renderer: {
          height: container.offsetHeight,
          width: container.offsetWidth,
        },
      });
    } else {
      console.log('No container for scene view');
    }
  }

  render() {
    const aspectratio = this.state.renderer.width / this.state.renderer.height;
    const cameraprops = {
      fov: 75,
      aspect: aspectratio,
      near: 1,
      far: 5000,
      position: this.controls ? this.controls.object.position : new THREE.Vector3(0, 0, 750),
      lookat: this.controls ? this.controls.target : new THREE.Vector3(0, 0, 0),
    };
    return (
      <div ref="sceneContainer" className="scene-view-container">
        <Renderer ref="renderer" width={this.state.renderer.width} height={this.state.renderer.height} background={0x282841}>
          <Scene camera="maincamera">
            <PerspectiveCamera ref="camera" name="maincamera" {...cameraprops} />
            {this.props.children}
          </Scene>
        </Renderer>
        <UIHierarchySceneFooter onSubmitChanges={this.props.onSubmitChanges} />
      </div>
    );
  }
}

export default UIHierarchyScene;
