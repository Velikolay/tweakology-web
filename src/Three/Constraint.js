const Direction = Object.freeze({
  HORIZONTAL: Symbol('horizontal'),
  VERTICAL: Symbol('vertical'),
});

const BRACKET_LEN = 10;

const getThreeD = (itemId, superview) => {
  if (superview.id === itemId) {
    return superview.threeD;
  }
  if (superview.children) {
    for (const child of superview.children) {
      if (child.type && child.id === itemId) {
        return child.threeD;
      }
    }
  }
  return null;
};

const toHorizontalIndicatorLines = ({
  x1, y1, z1, x2, y2, z2,
}) => (
  [{
    x1, y1, z1, x2, y2, z2,
  }, {
    x1, y1: y1 + BRACKET_LEN / 2, z1, x2: x1, y2: y1 - BRACKET_LEN / 2, z2: z1,
  }, {
    x1: x2, y1: y2 + BRACKET_LEN / 2, z1: z2, x2, y2: y2 - BRACKET_LEN / 2, z2,
  }]
);

const toVerticalIndicatorLines = ({
  x1, y1, z1, x2, y2, z2,
}) => (
  [{
    x1, y1, z1, x2, y2, z2,
  }, {
    x1: x1 + BRACKET_LEN / 2, y1, z1, x2: x1 - BRACKET_LEN / 2, y2: y1, z2: z1,
  }, {
    x1: x2 + BRACKET_LEN / 2, y1: y2, z1: z2, x2: x2 - BRACKET_LEN / 2, y2, z2,
  }]
);

const anchorDirection = (attr) => {
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

const anchorPoint = (attr, {
  x, y, z, width, height,
}) => {
  switch (attr) {
    case 1: // left
    case 5:
    case 13:
    case 17:
      return {
        x: x - width / 2, y, z,
      };
    case 2: // right
    case 6:
    case 14:
    case 18:
      return {
        x: x + width / 2, y, z,
      };
    case 3: // top
    case 15:
      return {
        x, y: y + height / 2, z,
      };
    case 4: // bottom
    case 16:
      return {
        x, y: y - height / 2, z,
      };
    default:
      return null;
  }
};

const toThreeConstraintIndicatorLineGroup = (node) => {
  const { properties: { constraint }, superview } = node;
  const { first, second } = constraint;
  const firstItem3D = getThreeD(first.item.value, superview);
  if (firstItem3D && first.attribute.value) {
    const firstAttr = parseInt(first.attribute.value, 10);
    const {
      x, y, z, width, height,
    } = firstItem3D;
    if (firstAttr === 7) { // width
      const x1 = x - width / 2;
      const y1 = y + height / 2 - 10;
      return toHorizontalIndicatorLines({
        x1, y1, z1: z, x2: x1 + width, y2: y1, z2: z,
      });
    }
    if (firstAttr === 8) { // height
      const x1 = x - width / 2 + 10;
      const y1 = y + height / 2;
      return toVerticalIndicatorLines({
        x1, y1, z1: z, x2: x1, y2: y1 - height, z2: z,
      });
    }
    if (second && second.attribute.value) {
      const secondAttr = parseInt(second.attribute.value, 10);
      const secondItem3D = getThreeD(second.item.value, superview);
      if (secondItem3D) {
        const p1 = anchorPoint(firstAttr, firstItem3D);
        const p2 = anchorPoint(secondAttr, secondItem3D);
        if (p1 && p2) {
          const direction = anchorDirection(firstAttr);
          if (direction === Direction.HORIZONTAL) {
            return toHorizontalIndicatorLines({
              x1: p1.x, y1: p1.y, z1: p1.z, x2: p2.x, y2: p1.y, z2: p2.z,
            });
          }
          if (direction === Direction.VERTICAL) {
            return toVerticalIndicatorLines({
              x1: p1.x, y1: p1.y, z1: p1.z, x2: p1.x, y2: p2.y, z2: p2.z,
            });
          }
        }
      }
    }
  }
  return [];
};

const toThreeConstraintIndicator = node => ({
  id: node.id,
  lineGroup: toThreeConstraintIndicatorLineGroup(node),
});

export default toThreeConstraintIndicator;
