import { attributeNames, relationSymbols } from '../Static/Constraints.js';
import { readPersistedValues } from '../Forms/Persistence/Presistence';

const updatedConstraintNodeName = (updated, node) => {
  return constraintNodeName(updated, node.superview);
}

const itemTypeById = (itemId, superview) => {
  if (superview) {
    if (superview.id === itemId) {
      return superview.type;
    } else {
      for (const childView of superview.children) {
        if (childView.type && childView.id === itemId) {
          return childView.type;
        }
      }
    }
  }
  // if the type hasn't been found return id
  return itemId;
}

const constraintNodeName = (constraint, superview) => {
  const isFirstInit = constraint.first && constraint.first.item.value && constraint.first.attribute.value;
  if (isFirstInit) {
    const relation = relationSymbols[constraint.relation];
    let name = `${attributeNames[constraint.first.attribute.value]} ${relation} `;
    if (constraint.first.item.value !== superview.id) {
      name = `${itemTypeById(constraint.first.item.value, superview)}.${name}`;
    }

    const isSecondInit = constraint.second && constraint.second.item.value && constraint.second.attribute.value;
    if (isSecondInit) {
      if (constraint.multiplier !== 1) {
        name += `${numToFixed(constraint.multiplier)} * `;
      }
      let secondItem = `${attributeNames[constraint.second.attribute.value]}`;
      if (constraint.second.item.value !== superview.id) {
        secondItem = `${itemTypeById(constraint.second.item.value, superview)}.${secondItem}`;
      }
      name += secondItem;
    }

    if (constraint.constant !== 0) {
      const constantToPrint = numToFixed(constraint.constant);
      if (constraint.constant > 0) {
        if (isSecondInit) {
          name += ` + ${constantToPrint}`;
        } else {
          name += ` ${constantToPrint}`;
        }
      } else {
        name += ` - ${-1*constantToPrint}`;
      }
    }
    return name;
  } else {
    return 'New Constraint';
  }
};

const constraintItemOptions = viewNode => {
  const itemOptions = [];
  if (isLeaf(viewNode)) {
    itemOptions.push({ label: viewNode.type, value: viewNode.id });
  } else {
    itemOptions.push({ label: 'Superview', value: viewNode.id });
    for (let childViewNode of viewNode.children) {
      if (childViewNode.type) {
        itemOptions.push({ label: childViewNode.type, value: childViewNode.id });
      }
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

const isLeaf = (viewNode) => {
  return viewNode.type === 'UILabel' || viewNode.type === 'UIButton';
};

const newConstraint = () => {
  return {
    first: {
      attribute: {
        value: ''
      },
      item: {
        value: ''
      }
    },
    second: {
      attribute: {
        value: ''
      },
      item: {
        value: ''
      }
    },
    isActive: true,
    relation: 0,
    multiplier: 0,
    constant: 0,
    priority: 1000
  }
}

const addNewConstraintToTreeNode = (node) => {
  const constraintsListNode = node.children[node.children.length - 1];
  if (constraintsListNode.module === 'Constraints') {
    const constraint = newConstraint();
    const constraintNode = {
      module: constraintNodeName(constraint, node),
      superview: node,
      type: 'NSLayoutConstraint',
      id: `${node.id}:c${constraintsListNode.children.length}`,
      properties: {
        constraint: constraint,
        itemOptions: constraintItemOptions(node)
      },
      leaf: true
    };
    constraintsListNode.children.push(constraintNode);
  }
}

const transformConstraintPayloadToTree = (viewNode, constraints)  => {
  return {
    module: 'Constraints',
    superview: viewNode,
    collapsed: true,
    children: constraints.map((constraint, idx) => {
      const constraintId = `${viewNode.id}:c${idx}`;
      const persistedConstraint = readPersistedValues(constraintId);
      return {
        module: constraintNodeName(persistedConstraint ? persistedConstraint : constraint, viewNode),
        superview: viewNode,
        type: 'NSLayoutConstraint',
        id: constraintId,
        properties: {
          constraint: constraint,
          itemOptions: constraintItemOptions(viewNode)
        },
        leaf: true
      }
    })
  };
};

export { transformConstraintPayloadToTree, addNewConstraintToTreeNode, updatedConstraintNodeName };