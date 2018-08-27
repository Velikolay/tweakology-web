// import React, { Component } from 'react';
import React from 'react';
import { Line } from 'react-three';

const THREE = require('three');

const bracketLen = 12;

// class UIElementConstraintLine extends Component {
//   render() {
const UIElementConstraintLine = (props) => {
  const {
    x1, y1, z1,
    x2, y2, z2,
  } = props;

  const p1 = new THREE.Vector3(x1, y1, z1);
  const p2 = new THREE.Vector3(x2, y2, z2);

  const matertial = new THREE.LineBasicMaterial({ color: 0x00bfff, linewidth: 2 });
  const geometry = new THREE.Geometry();
  geometry.vertices.push(p1);
  geometry.vertices.push(p2);

  const lineProps = { geometry, matertial };
  return <Line {...lineProps} />;
};
// }
export default UIElementConstraintLine;

const lineProps = ({
  x1, y1, z1, x2, y2, z2,
}) => {
  const deltaY = y2 - y1;
  const deltaX = x2 - x1;
  const angleInRad = Math.atan2(deltaY, deltaX);

  const xOffset = Math.sin(angleInRad) * bracketLen / 2;
  const yOffset = Math.cos(angleInRad) * bracketLen / 2;

  const bfx1 = x1 + xOffset;
  const bfx2 = x1 - xOffset;
  const bfy1 = y1 + yOffset;
  const bfy2 = y1 - yOffset;

  const bsx1 = x2 + xOffset;
  const bsx2 = x2 - xOffset;
  const bsy1 = y2 + yOffset;
  const bsy2 = y2 - yOffset;

  return [{
    x1, y1, z1, x2, y2, z2,
  }, {
    x1: bfx1, y1: bfy1, z1, x2: bfx2, y2: bfy2, z2: z1,
  }, {
    x1: bsx1, y1: bsy1, z1: z2, x2: bsx2, y2: bsy2, z2,
  }];
};

export { lineProps };
