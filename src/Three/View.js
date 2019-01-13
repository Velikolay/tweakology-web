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

const toThreeViews = (
  { tree, activeNode, onFocusNode },
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
  const { frame } = updatedProperties || properties;
  const meshTree = {
    id,
    revision,
    imgUrl,
    selected: isSelected(treeNode, activeNode),
    onFocus: onFocusNode !== null && onFocusNode.id === id,
    ...frame,
    z: depthCounter.getAndIncrement(),
    children: [],
  };
  if (children) {
    children.forEach(childNode => {
      if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
        const childMeshTree = toThreeViews(
          { tree: childNode, activeNode, onFocusNode },
          depthCounter,
        );
        meshTree.children.push(childMeshTree);
      }
    });
  }
  return meshTree;
};

export default toThreeViews;
