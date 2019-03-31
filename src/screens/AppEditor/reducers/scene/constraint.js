const Direction = Object.freeze({
  HORIZONTAL: Symbol('horizontal'),
  VERTICAL: Symbol('vertical'),
});

const AnchorOriginPoint = Object.freeze({
  FIRST: Symbol('first'),
  SECOND: Symbol('second'),
  NONE: Symbol('none'),
});

const BRACKET_LEN = 8;

const findNode = (treeNode, id) => {
  const { id: nodeId, children } = treeNode;
  if (nodeId === id) {
    return treeNode;
  }
  if (children) {
    for (const childNode of children) {
      const node = findNode(childNode, id);
      if (node) return node;
    }
  }
  return null;
};

const makeHorizontal = ({ p1, p2 }, origin) =>
  origin === AnchorOriginPoint.SECOND
    ? {
        p1: p2,
        p2: { x: p1.x, y: p2.y, z: p1.z },
      }
    : {
        p1,
        p2: { x: p2.x, y: p1.y, z: p2.z },
      };

const makeVertical = ({ p1, p2 }, origin) =>
  origin === AnchorOriginPoint.SECOND
    ? {
        p1: p2,
        p2: { x: p2.x, y: p1.y, z: p1.z },
      }
    : {
        p1,
        p2: { x: p1.x, y: p2.y, z: p2.z },
      };

const makeDirection = ({ p1, p2 }, origin, direction) =>
  direction === Direction.HORIZONTAL
    ? makeHorizontal({ p1, p2 }, origin)
    : makeVertical({ p1, p2 }, origin);

const toHorizontalExtension = ({ p1, p2 }) => ({
  p1: p2,
  p2: { x: p1.x, y: p2.y, z: p2.z },
});

const toVerticalExtension = ({ p1, p2 }) => ({
  p1: p2,
  p2: { x: p2.x, y: p1.y, z: p2.z },
});

const toExtension = ({ p1, p2 }, direction) =>
  direction === Direction.HORIZONTAL
    ? toVerticalExtension({ p1, p2 })
    : toHorizontalExtension({ p1, p2 });

const toHorizontalLineSegment = ({ p1, p2 }) => [
  { p1, p2 },
  {
    p1: { x: p1.x, y: p1.y + BRACKET_LEN / 2, z: p1.z },
    p2: { x: p1.x, y: p1.y - BRACKET_LEN / 2, z: p1.z },
  },
  {
    p1: { x: p2.x, y: p2.y + BRACKET_LEN / 2, z: p2.z },
    p2: { x: p2.x, y: p2.y - BRACKET_LEN / 2, z: p2.z },
  },
];

const toVerticalLineSegment = ({ p1, p2 }) => [
  { p1, p2 },
  {
    p1: { x: p1.x + BRACKET_LEN / 2, y: p1.y, z: p1.z },
    p2: { x: p1.x - BRACKET_LEN / 2, y: p1.y, z: p1.z },
  },
  {
    p1: { x: p2.x + BRACKET_LEN / 2, y: p2.y, z: p2.z },
    p2: { x: p2.x - BRACKET_LEN / 2, y: p2.y, z: p2.z },
  },
];

const toLineSegment = ({ p1, p2 }, direction) =>
  direction === Direction.HORIZONTAL
    ? toHorizontalLineSegment({ p1, p2 })
    : toVerticalLineSegment({ p1, p2 });

const horizontalAnchorOriginPoint = (
  { pos: { y: y1 }, dim: { height: height1 } },
  { pos: { y: y2 }, dim: { height: height2 } },
) => {
  if (
    y1 + height1 / 2 >= y2 &&
    y1 + height1 / 2 <= y2 + height2 &&
    height1 < height2
  ) {
    return AnchorOriginPoint.FIRST;
  }
  if (
    y2 + height2 / 2 >= y1 &&
    y2 + height2 / 2 <= y1 + height1 &&
    height2 < height1
  ) {
    return AnchorOriginPoint.SECOND;
  }
  return AnchorOriginPoint.NONE;
};

const verticalAnchorOriginPoint = (
  { pos: { x: x1 }, dim: { width: width1 } },
  { pos: { x: x2 }, dim: { width: width2 } },
) => {
  if (
    x1 + width1 / 2 >= x2 &&
    x1 + width1 / 2 <= x2 + width2 &&
    width1 < width2
  ) {
    return AnchorOriginPoint.FIRST;
  }
  if (
    x2 + width2 / 2 >= x1 &&
    x2 + width2 / 2 <= x1 + width1 &&
    width2 < width1
  ) {
    return AnchorOriginPoint.SECOND;
  }
  return AnchorOriginPoint.NONE;
};

const anchorOriginPoint = (firstItemPosDim, secondItemPosDim, direction) =>
  direction === Direction.HORIZONTAL
    ? horizontalAnchorOriginPoint(firstItemPosDim, secondItemPosDim)
    : verticalAnchorOriginPoint(firstItemPosDim, secondItemPosDim);

const anchorDirection = attr => {
  switch (attr) {
    case 1: // left
    case 5:
    case 13:
    case 17:
    case 2: // right
    case 6:
    case 14:
    case 18:
      return Direction.HORIZONTAL;
    case 3: // top
    case 15:
    case 4: // bottom
    case 16:
      return Direction.VERTICAL;
    default:
      return null;
  }
};

const anchorPoint = (attr, { pos: { x, y, z }, dim: { width, height } }) => {
  switch (attr) {
    case 1: // left
    case 5:
    case 13:
    case 17:
      return {
        x,
        y: y + height / 2,
        z,
      };
    case 2: // right
    case 6:
    case 14:
    case 18:
      return {
        x: x + width,
        y: y + height / 2,
        z,
      };
    case 3: // top
    case 15:
      return {
        x: x + width / 2,
        y,
        z,
      };
    case 4: // bottom
    case 16:
      return {
        x: x + width / 2,
        y: y + height,
        z,
      };
    default:
      return null;
  }
};

const toBasePosDim = (item, baseview) => {
  const { x, y, z, width, height } = item;
  return item.id === baseview.id
    ? { pos: { x: 0, y: 0, z: 0 }, dim: { width, height } }
    : { pos: { x, y, z }, dim: { width, height } };
};

const toSceneConstraintLines = ({ tree, activeNode }) => {
  const { superview: baseview, properties, updatedProperties } = activeNode;
  const { first, second } = updatedProperties || properties;

  if (first && first.item && first.attribute) {
    const firstItemNode = findNode(tree, first.item);
    if (firstItemNode) {
      const firstItemPosDim = toBasePosDim(firstItemNode, baseview);
      const {
        pos: { x, y, z },
        dim: { width, height },
      } = firstItemPosDim;
      const firstAttr = parseInt(first.attribute, 10);
      if (firstAttr === 7) {
        // width
        return toHorizontalLineSegment({
          p1: { x, y: y + height / 2, z },
          p2: { x: x + width, y: y + height / 2, z },
        });
      }
      if (firstAttr === 8) {
        // height
        return toVerticalLineSegment({
          p1: { x: x + width / 2, y, z },
          p2: { x: x + width / 2, y: y + height, z },
        });
      }
      if (second && second.item && second.attribute) {
        const secondAttr = parseInt(second.attribute, 10);
        const secondItemNode = findNode(tree, second.item);
        if (secondItemNode) {
          const secondItemPosDim = toBasePosDim(secondItemNode, baseview);
          const p1 = anchorPoint(firstAttr, firstItemPosDim);
          const p2 = anchorPoint(secondAttr, secondItemPosDim);
          if (p1 && p2) {
            const direction = anchorDirection(firstAttr);
            const origin = anchorOriginPoint(
              firstItemPosDim,
              secondItemPosDim,
              direction,
            );
            const lineSegment = toLineSegment(
              makeDirection({ p1, p2 }, origin, direction),
              direction,
            );
            if (origin === AnchorOriginPoint.NONE) {
              return [toExtension({ p1, p2 }, direction), ...lineSegment];
            }
            return lineSegment;
          }
        }
      }
    }
  }
  return [];
};

const SceneConstraintReducer = {
  mapStateToProps: ({ tree, activeNode }) => ({
    id: activeNode.id,
    lines: toSceneConstraintLines({ tree, activeNode }),
  }),
};

export default SceneConstraintReducer;
