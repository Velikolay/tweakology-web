import React, { Component } from 'react';
import { Mesh, LineSegments } from 'react-three';

const THREE = require('three');

class UIElementMesh extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
      onFocus: props.onFocus,
    };
  }

  componentWillMount() {
    const { imgUrl } = this.props;
    this.setState({
      texture: new THREE.TextureLoader().load(imgUrl),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.updateTexture) {
      const { imgUrl } = this.props;
      new THREE.TextureLoader().load(
        imgUrl,
        texture => this.setState({ texture }),
      );
    }
    this.setState({
      selected: nextProps.selected,
      onFocus: nextProps.onFocus,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.updateTexture) {
      return true;
    }
    const {
      selected,
      onFocus,
    } = this.state;
    if (selected !== nextState.selected) {
      return true;
    }
    if (onFocus !== nextState.onFocus) {
      return true;
    }
    return false;
  }

  render() {
    const {
      texture,
      selected,
      onFocus,
    } = this.state;

    const {
      x, y, z,
      width, height,
    } = this.props;
    const img = new THREE.MeshBasicMaterial({
      map: texture,
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

    const meshProps = {
      position: new THREE.Vector3(x, y, z * 5),
      geometry: new THREE.PlaneGeometry(width, height),
      material: img,
    };

    let wireframeColor = 0x666666;
    if (selected) {
      wireframeColor = 0x2566c6;
    } else if (onFocus) {
      wireframeColor = 0xcccccc;
    }

    const wireframeProps = {
      geometry: new THREE.EdgesGeometry(meshProps.geometry),
      material: new THREE.LineBasicMaterial({
        color: wireframeColor,
        linewidth: 1,
      }),
    };

    const overlayProps = {
      geometry: meshProps.geometry,
      material: selectOverlay,
    };

    return (
      <Mesh {...meshProps}>
        <LineSegments {...wireframeProps} />
        { selected
          ? <Mesh {...overlayProps} />
          : null
      }
      </Mesh>
    );
  }
}

export default UIElementMesh;
