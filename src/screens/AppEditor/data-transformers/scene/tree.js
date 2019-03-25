const isSelected = (node, activeNode) => {
  let selected = activeNode && activeNode.id === node.id;
  if (!selected && activeNode.type === 'NSLayoutConstraint') {
    const constraint =
      'updatedProperties' in activeNode
        ? activeNode.updatedProperties
        : activeNode.properties;

    if (constraint.first && constraint.first.item.value === node.id) {
      selected = true;
    }

    if (constraint.second && constraint.second.item.value === node.id) {
      selected = true;
    }
  }
  return selected;
};

const offsetRectDim = (frame, offset) => {
  if (offset) {
    const { x: offX, y: offY } = offset;
    const { x, y, ...rest } = frame;
    return {
      x: x - offX,
      y: y - offY,
      ...rest,
    };
  }
  return frame;
};

const mergeIntoDepthMap = (toDepthMap, fromDepthMap, offset) => {
  fromDepthMap.forEach((rectDims, relDepth) => {
    if (toDepthMap.length <= relDepth + offset) {
      toDepthMap.push([]);
    }
    toDepthMap[relDepth + offset].push(...rectDims);
  });
};

const doIntersect = (rect1, rect2) => {
  const { x: x1, y: y1, height: h1, width: w1 } = rect1;
  const { x: x2, y: y2, height: h2, width: w2 } = rect2;
  return !(x2 > x1 + w1 || x2 + w2 < x1 || y2 > y1 + h1 || y2 + h2 < y1);
};

const findOverlappingRectDepth = (rect, depthMap, fromDepth) => {
  for (let i = fromDepth; i < depthMap.length; i += 1) {
    if (depthMap[i].filter(r => doIntersect(rect, r)).length > 0) {
      return i;
    }
  }
  return 0;
};

const calcRelDepth = (parent, child, testDepth = 1) => {
  const { depthMap: pdm } = parent;
  const { depthMap: cdm } = child;

  let i = 0;
  let j = 0;
  const increment = () => {
    j += 1;
    if (j === cdm[i].length) {
      j = 0;
      i += 1;
    }
  };

  let overlappingRectDepth = 0;
  do {
    overlappingRectDepth = findOverlappingRectDepth(cdm[i][j], pdm, testDepth);
  } while (i < cdm.length && !overlappingRectDepth && increment());

  if (overlappingRectDepth) {
    return calcRelDepth(parent, child, overlappingRectDepth - i + 1);
  }
  return testDepth;
};

const TreeTransformer = {
  toScene: (
    { tree, activeNode, onFocusNode },
    offset = { x: 0, y: 0 },
    globalOriginBase = { x: 0, y: 0 },
  ) => {
    const treeNode = tree;
    if (
      Object.keys(treeNode).length === 0 ||
      treeNode.module === 'Loading...'
    ) {
      return null;
    }

    const {
      id,
      revision,
      imgUrl,
      children,
      properties,
      updatedProperties,
    } = treeNode;
    const { contentOffset, isHidden } = properties;
    const { frame } = updatedProperties || properties;
    const rectDim = offsetRectDim(frame, offset);
    const globalOrigin = {
      x: globalOriginBase.x + rectDim.x,
      y: globalOriginBase.y + rectDim.y,
    };
    const globalFrame = {
      ...globalOrigin,
      width: rectDim.width,
      height: rectDim.height,
    };
    const meshTree = {
      id,
      revision,
      imgUrl,
      selected: isSelected(treeNode, activeNode),
      onFocus: onFocusNode !== null && onFocusNode.id === id,
      ...rectDim,
      z: 1,
      isHidden,
      depthMap: [[globalFrame]],
      children: [],
    };
    if (children) {
      children.forEach(childNode => {
        if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
          const childMeshTree = TreeTransformer.toScene(
            { tree: childNode, activeNode, onFocusNode },
            contentOffset,
            globalOrigin,
          );
          childMeshTree.z = calcRelDepth(meshTree, childMeshTree);
          mergeIntoDepthMap(
            meshTree.depthMap,
            childMeshTree.depthMap,
            childMeshTree.z,
          );
          meshTree.children.push(childMeshTree);
        }
      });
    }
    return meshTree;
  },
};

export default TreeTransformer;
