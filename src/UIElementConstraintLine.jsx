// import React, { Component } from 'react';
import React from 'react';
import { Line } from 'react-three';

const THREE = require('three');

// class UIElementConstraintLine extends Component {
//   render() {
const UIElementConstraintLine = (props) => {
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

  const lineProps = { geometry, matertial };
  return <Line {...lineProps} />;
};
// }
export default UIElementConstraintLine;
