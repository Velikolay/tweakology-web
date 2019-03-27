import {
  attributeNames,
  relationSymbols,
} from '../../services/device/metadata/NSLayoutConstraints';

const numToFixed = num => {
  if (num % 1 !== 0) {
    return Number.parseFloat(num).toFixed(1);
  }
  return num;
};

const isLeaf = ({ type }) =>
  type === 'UILabel' || type === 'UIButton' || type === 'UIImageView';

const itemTypeById = (itemId, superview) => {
  if (superview) {
    if (superview.id === itemId) {
      return superview.type;
    }
    const item = superview.children.find(c => c.type && c.id === itemId);
    if (item) return item.type;
  }
  // if the type hasn't been found return id
  return itemId;
};

const newConstraint = () => ({
  meta: {
    synced: false,
    added: true,
  },
  isActive: true,
  relation: 0,
  multiplier: 1,
  constant: 0,
  priority: 1000,
});

const constraintNodeName = node => {
  const { properties, updatedProperties, superview } = node;
  const constraint = updatedProperties || properties;
  const isFirstInit =
    constraint.first && constraint.first.item && constraint.first.attribute;
  if (isFirstInit) {
    const relation = relationSymbols[constraint.relation];
    let name = `${attributeNames[constraint.first.attribute]} ${relation} `;
    if (constraint.first.item !== superview.id) {
      name = `${itemTypeById(constraint.first.item, superview)}.${name}`;
    }

    const isSecondInit =
      constraint.second &&
      constraint.second.item &&
      constraint.second.attribute;
    if (isSecondInit) {
      if (constraint.multiplier !== 1) {
        name += `${numToFixed(constraint.multiplier)} * `;
      }
      let secondItem = `${attributeNames[constraint.second.attribute]} `;
      if (constraint.second.item !== superview.id) {
        secondItem = `${itemTypeById(
          constraint.second.item,
          superview,
        )}.${secondItem}`;
      }
      name += secondItem;
    }

    const constantToPrint = numToFixed(constraint.constant);
    if (constraint.constant === 0) {
      if (!isSecondInit) {
        name += `${constantToPrint}`;
      }
    } else if (constraint.constant > 0) {
      if (!isSecondInit) {
        name += `${constantToPrint}`;
      } else {
        name += `+ ${constantToPrint}`;
      }
    } else {
      name += `- ${-1 * constantToPrint}`;
    }
    return name;
  }
  return 'New Constraint';
};

const getConstraintItemOptions = node => {
  const itemOptions = [];
  if (isLeaf(node)) {
    itemOptions.push({ label: node.name, value: node.id });
  } else {
    itemOptions.push({ label: 'Superview', value: node.id });
    for (const childNode of node.children) {
      if (childNode.type) {
        itemOptions.push({
          label: childNode.type,
          value: childNode.id,
        });
      }
    }
  }
  return itemOptions;
};

const addConstraintToNode = node => {
  const constraintsListNode = node.children[node.children.length - 1];
  if (constraintsListNode.module === 'Constraints') {
    const idx = constraintsListNode.children.length;
    const constraintId = `${node.id}.constraints:${idx}`;
    const constraint = newConstraint();
    const constraintNode = {
      superview: node,
      type: 'NSLayoutConstraint',
      id: constraintId,
      properties: {
        ...constraint,
        itemOptions: getConstraintItemOptions(node),
      },
      leaf: true,
    };
    constraintNode.module = constraintNodeName(constraintNode);
    constraintsListNode.children.push(constraintNode);
  }
};

export { getConstraintItemOptions, addConstraintToNode, constraintNodeName };
