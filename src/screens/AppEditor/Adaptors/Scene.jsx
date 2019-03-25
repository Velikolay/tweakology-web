import React from 'react';

import {
  TreeRootNodeShape,
  TreeNodeShape,
} from '../../../containers/Tree/Shapes';

import Scene from '../../../containers/Scene/Scene';

import TreeTransformer from '../data-transformers/scene/tree';
import ConstraintTransformer from '../data-transformers/scene/constraint';

const SceneAdaptor = props => {
  const constraintIndicators = [];
  const { tree, activeNode, onFocusNode, ...other } = props;
  if (activeNode && activeNode.type === 'NSLayoutConstraint') {
    constraintIndicators.push(ConstraintTransformer.toScene(activeNode));
  }
  return (
    <Scene
      tree={TreeTransformer.toScene({ tree, activeNode, onFocusNode })}
      constraintIndicators={constraintIndicators}
      {...other}
    />
  );
};

SceneAdaptor.propTypes = {
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
};

SceneAdaptor.defaultProps = {
  activeNode: null,
  onFocusNode: null,
};

export default SceneAdaptor;
