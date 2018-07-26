import { attributeNames } from '../Static/Constraints.js';

const updatedConstraintNodeName = (updated, node) => {
  return constraintNodeName(updated, node.id.split(':')[0]);
}

const constraintNodeName = (constraint, superviewUid) => {
  let name = `${attributeNames[constraint.first.attribute.value]} = `;
  if (constraint.first.item.value !== superviewUid) {
    name = `${constraint.first.item.value}.${name}`;
  }

  if (constraint.second) {
    if (constraint.multiplier !== 1) {
      name += `${numToFixed(constraint.multiplier)} * `;
    }
    let secondItem = `${attributeNames[constraint.second.attribute.value]}`;
    if (constraint.second.item.value !== superviewUid) {
      secondItem = `${constraint.second.item.value}.${secondItem}`;
    }
    name += secondItem;
  }

  if (constraint.constant !== 0) {
    const constantToPrint = numToFixed(constraint.constant);
    if (constraint.constant > 0) {
      if (constraint.second) {
        name += ` + ${constantToPrint}`;
      } else {
        name += ` ${constantToPrint}`;
      }
    } else {
      name += ` - ${-1*constantToPrint}`;
    }
  }
  return name;
};

const constraintItemOptions = uiElement => {
  const itemOptions = [];
  if (isLeaf(uiElement)) {
    itemOptions.push({ label: uiElement.type, value: uiElement.uid });
  } else {
    itemOptions.push({ label: 'Superview', value: uiElement.uid });
    for (let subview of uiElement.subviews) {
      itemOptions.push({ label: subview.type, value: subview.uid });
    }
  }
  return itemOptions;
};

const numToFixed = num => {
  if (num % 1 !== 0) {
    return Number.parseFloat(num).toFixed(1);
  }
  return num;
};

const isLeaf = (uiElement) => {
  return !uiElement.subviews || uiElement.type === 'UIButton';
};

const transformConstraintPayloadToTree = uiElement => {
  return {
    module: 'Constraints',
    collapsed: true,
    children: uiElement['constraints'].map((constraint, idx) => {
      return {
        module: constraintNodeName(constraint, uiElement.uid),
        type: 'NSLayoutConstraint',
        id: `${uiElement.uid}:c${idx}`,
        properties: {
          constraint: constraint,
          itemOptions: constraintItemOptions(uiElement)
        },
        leaf: true
      }
    })
  };
};

export { transformConstraintPayloadToTree, updatedConstraintNodeName };