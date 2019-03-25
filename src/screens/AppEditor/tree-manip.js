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

const newConstraint = () => ({
  meta: {
    synced: false,
    added: true,
  },
  first: {
    attribute: {
      value: '',
    },
    item: {
      value: '',
      placeholder: 'Item1',
    },
  },
  second: {
    attribute: {
      value: '',
    },
    item: {
      value: '',
      placeholder: 'Item2',
    },
  },
  isActive: true,
  relation: '0',
  multiplier: 1,
  constant: 0,
  priority: 1000,
});

const itemTypeById = (itemId, superview) => {
  if (superview) {
    if (superview.id === itemId) {
      return superview.type;
    }
    for (const childView of superview.children) {
      if (childView.type && childView.id === itemId) {
        return childView.type;
      }
    }
  }
  // if the type hasn't been found return id
  return itemId;
};

const constraintNodeName = (constraint, superview) => {
  const isFirstInit =
    constraint.first &&
    constraint.first.item.value &&
    constraint.first.attribute.value;
  if (isFirstInit) {
    const relation = relationSymbols[constraint.relation];
    let name = `${
      attributeNames[constraint.first.attribute.value]
    } ${relation} `;
    if (constraint.first.item.value !== superview.id) {
      name = `${itemTypeById(constraint.first.item.value, superview)}.${name}`;
    }

    const isSecondInit =
      constraint.second &&
      constraint.second.item.value &&
      constraint.second.attribute.value;
    if (isSecondInit) {
      if (constraint.multiplier !== 1) {
        name += `${numToFixed(constraint.multiplier)} * `;
      }
      let secondItem = `${attributeNames[constraint.second.attribute.value]} `;
      if (constraint.second.item.value !== superview.id) {
        secondItem = `${itemTypeById(
          constraint.second.item.value,
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

const updatedConstraintNodeName = node =>
  constraintNodeName(node.updatedProperties, node.superview);

const addConstraintToNode = node => {
  const constraintsListNode = node.children[node.children.length - 1];
  if (constraintsListNode.module === 'Constraints') {
    const idx = constraintsListNode.children.length;
    const constraintId = `${node.id}.constraints:${idx}`;
    const constraint = newConstraint();
    const constraintNode = {
      module: constraintNodeName(constraint, node),
      superview: node,
      type: 'NSLayoutConstraint',
      id: constraintId,
      properties: {
        ...constraint,
        itemOptions: getConstraintItemOptions(node),
      },
      leaf: true,
    };
    constraintsListNode.children.push(constraintNode);
  }
};

export {
  getConstraintItemOptions,
  addConstraintToNode,
  constraintNodeName,
  updatedConstraintNodeName,
};
