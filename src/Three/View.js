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

const toThreeViews = ({ tree, activeNode, onFocusNode }, depth = 0) => {
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
    z: depth,
    children: [],
  };
  if (children) {
    let depthCnt = depth;
    children.forEach(childNode => {
      if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
        depthCnt += 1;
        const childMeshTree = toThreeViews(
          { tree: childNode, activeNode, onFocusNode },
          depthCnt,
        );
        meshTree.children.push(childMeshTree);
      }
    });
  }
  return meshTree;
};

export default toThreeViews;
