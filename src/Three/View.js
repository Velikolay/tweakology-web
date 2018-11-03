const isSelected = (node, activeNode) => {
  let selected = activeNode && activeNode.id === node.id;
  if (!selected && activeNode.type === 'NSLayoutConstraint') {
    const constraint = 'updatedProperties' in activeNode ? activeNode.updatedProperties.constraint : activeNode.properties.constraint;

    if (constraint.first && constraint.first.item.value === node.id) {
      selected = true;
    }

    if (constraint.second && constraint.second.item.value === node.id) {
      selected = true;
    }
  }
  return selected;
};

const toThreeViews = ({ tree, activeNode, onFocusNode }) => {
  const treeNode = tree;
  if (Object.keys(treeNode).length === 0 || treeNode.module === 'Loading...') {
    return [];
  }

  const {
    id, revision, children, threeD,
  } = treeNode;

  const meshProps = [{
    id,
    revision,
    imgUrl: `http://NIKOIVAN02M.local:8080/images?path=${treeNode.hierarchyMetadata}`,
    selected: isSelected(treeNode, activeNode),
    onFocus: onFocusNode !== null && onFocusNode.id === id,
    ...threeD,
  }];
  if (children) {
    for (const childNode of children) {
      if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
        const childrenMeshProps = toThreeViews({ tree: childNode, activeNode, onFocusNode });
        meshProps.push(...childrenMeshProps);
      }
    }
  }
  return meshProps;
};

export default toThreeViews;
