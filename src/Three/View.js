const isSelected = (node, activeNode) => {
  let selected = activeNode && activeNode.id === node.id;
  if (!selected && activeNode.type === 'NSLayoutConstraint') {
    const constraint =
      'updatedProperties' in activeNode
        ? activeNode.updatedProperties.constraint
        : activeNode.properties.constraint;

    if (constraint.first && constraint.first.item.value === node.id) {
      selected = true;
    }

    if (constraint.second && constraint.second.item.value === node.id) {
      selected = true;
    }
  }
  return selected;
};

class DepthCounter {
  constructor() {
    this.counter = 0;
  }

  getAndIncrement = () => {
    const res = this.counter;
    this.counter += 1;
    return res;
  };
}

const calcRectDimensions = (frame, offset) => {
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

const toThreeViews = (
  { tree, activeNode, onFocusNode },
  offset = { x: 0, y: 0 },
  depthCounter = new DepthCounter(),
) => {
  const treeNode = tree;
  if (Object.keys(treeNode).length === 0 || treeNode.module === 'Loading...') {
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
  const { frame, contentOffset } = updatedProperties || properties;
  const meshTree = {
    id,
    revision,
    imgUrl,
    selected: isSelected(treeNode, activeNode),
    onFocus: onFocusNode !== null && onFocusNode.id === id,
    ...calcRectDimensions(frame, offset),
    z: depthCounter.getAndIncrement(),
    children: [],
  };
  if (children) {
    children.forEach(childNode => {
      if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
        const childMeshTree = toThreeViews(
          { tree: childNode, activeNode, onFocusNode },
          contentOffset,
          depthCounter,
        );
        meshTree.children.push(childMeshTree);
      }
    });
  }
  return meshTree;
};

export default toThreeViews;
