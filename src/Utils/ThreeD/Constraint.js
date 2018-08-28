const HORIZONTAL_ANCHOR = 1;
const VERTICAL_ANCHOR = 2;
const bracketLen = 10;

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

const toLinePoints = ({
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

// case noAttribute 0
// case left 1
// case right 2
// case top 3
// case bottom 4
// case leading 5
// case trailing 6
// case width 7
// case height 8
// case centerX 9
// case centerY 10
// case lastBaseline 11
// case firstBaseline 12
// case leftMargin 13
// case rightMargin 14
// case topMargin 15
// case bottomMargin 16
// case leadingMargin 17
// case trailingMargin 18
// case centerXWithinMargins 19
// case centerYWithinMargins 20

const anchorPoint = (attr, {
  x, y, z, width, height,
}) => {
  switch (attr) {
    case 1: // left
    case 5:
    case 13:
    case 17:
      return {
        x: x - width / 2, y, z, direction: HORIZONTAL_ANCHOR,
      };
    case 2: // right
    case 6:
    case 14:
    case 18:
      return {
        x: x + width / 2, y, z, direction: HORIZONTAL_ANCHOR,
      };
    case 3: // top
    case 15:
      return {
        x, y: y + height / 2, z, direction: VERTICAL_ANCHOR,
      };
    case 4: // bottom
    case 16:
      return {
        x, y: y - height / 2, z, direction: VERTICAL_ANCHOR,
      };
    default:
      return null;
  }
};

const toConstraintIndicator = (node) => {
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
      return toLinePoints({
        x1, y1, z1: z, x2: x1 + width, y2: y1, z2: z,
      });
    }
    if (firstAttr === 8) { // height
      const x1 = x - width / 2 + 10;
      const y1 = y + height / 2;
      return toLinePoints({
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
          if (p1.direction === HORIZONTAL_ANCHOR) {
            return toLinePoints({
              x1: p1.x, y1: p1.y, z1: p1.z, x2: p2.x, y2: p1.y, z2: p2.z,
            });
          }
          if (p1.direction === VERTICAL_ANCHOR) {
            return toLinePoints({
              x1: p1.x, y1: p1.y, z1: p1.z, x2: p1.x, y2: p2.y, z2: p2.z,
            });
          }
        }
      }
    }
  }
  return [];
};

export default toConstraintIndicator;
