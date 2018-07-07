import React, { Component } from 'react';
import { Mesh, LineSegments } from 'react-three';

const THREE = require('three');

class UIElementMesh extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
      onFocus: props.onFocus
    }
  }

  componentWillMount() {
    this.setState({
      texture: new THREE.TextureLoader().load(this.props.imgUrl)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateTexture) {
      new THREE.TextureLoader().load(
        this.props.imgUrl,
        (texture) => this.setState({texture: texture})
      );
    }
    this.setState({
      selected: nextProps.selected,
      onFocus: nextProps.onFocus
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.updateTexture) {
      return true;
    }
    if (this.state.selected !== nextState.selected) {
      return true;
    }
    if (this.state.onFocus !== nextState.onFocus) {
      return true;
    }
    return false;
  }

  render() {
    const img = new THREE.MeshBasicMaterial({
      map: this.state.texture,
      side: THREE.DoubleSide,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1
    });
    // img.map.needsUpdate = true;
    img.map.minFilter = THREE.LinearFilter;

    const selectOverlay = new THREE.MeshBasicMaterial({
      color: 0x00bfff,
      side: THREE.DoubleSide,
      opacity: 0.35,
      transparent: true
    });

    const meshProps = {
      position : new THREE.Vector3(this.props.x, this.props.y, this.props.z*5),
      geometry: new THREE.PlaneGeometry(this.props.width, this.props.height),
      material: img
    };

    let wireframeColor = 0x666666;
    if (this.state.selected) {
      wireframeColor = 0x2566c6;
    } else if (this.state.onFocus) {
      wireframeColor = 0xcccccc;
    }

    const wireframeProps = {
      geometry: new THREE.EdgesGeometry(meshProps.geometry),
      material: new THREE.LineBasicMaterial({
        color: wireframeColor,
        linewidth: 1
      })
    }

    const overlayProps = {
      geometry: meshProps.geometry,
      material: selectOverlay
    }

    return <Mesh {...meshProps}>
      <LineSegments {...wireframeProps} />
      { this.state.selected ?
          <Mesh {...overlayProps} />
          :
          null
      }
    </Mesh>
  }
}

export default UIElementMesh;