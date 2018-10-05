import { attributeNames, relationSymbols } from '../../Static/Constraints';
import { readPersistedValues, readPersistedConstraints } from '../../Forms/Persistence/Presistence';
import ConstraintTransformer from '../../Transformers/Constraint';

const numToFixed = (num) => {
  if (num % 1 !== 0) {
    return Number.parseFloat(num).toFixed(1);
  }
  return num;
};

const isLeaf = viewNode => viewNode.type === 'UILabel' || viewNode.type === 'UIButton';

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
  const isFirstInit = constraint.first
                    && constraint.first.item.value
                    && constraint.first.attribute.value;
  if (isFirstInit) {
    const relation = relationSymbols[constraint.relation];
    let name = `${attributeNames[constraint.first.attribute.value]} ${relation} `;
    if (constraint.first.item.value !== superview.id) {
      name = `${itemTypeById(constraint.first.item.value, superview)}.${name}`;
    }

    const isSecondInit = constraint.second
                      && constraint.second.item.value
                      && constraint.second.attribute.value;
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
        name += ` - ${-1 * constantToPrint}`;
      }
    }
    return name;
  }
  return 'New Constraint';
};

const constraintItemOptions = (viewNode) => {
  const itemOptions = [];
  if (isLeaf(viewNode)) {
    itemOptions.push({ label: viewNode.type, value: viewNode.id });
  } else {
    itemOptions.push({ label: 'Superview', value: viewNode.id });
    for (const childViewNode of viewNode.children) {
      if (childViewNode.type) {
        itemOptions.push({ label: childViewNode.type, value: childViewNode.id });
      }
    }
  }
  return itemOptions;
};

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

const updatedConstraintNodeName = node => constraintNodeName(
  node.updatedProperties.constraint,
  node.superview,
);

const addNewConstraintToTreeNode = (node) => {
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
        constraint,
        itemOptions: constraintItemOptions(node),
      },
      leaf: true,
    };
    constraintsListNode.children.push(constraintNode);
  }
};

const transformConstraintPayloadToTree = (viewNode, constraints) => {
  const constraintNodes = constraints.map(ConstraintTransformer.fromPayload);
  const lastIdx = constraintNodes.length - 1;
  const constraintsByView = readPersistedConstraints();
  if (viewNode.id in constraintsByView) {
    const localOnly = constraintsByView[viewNode.id]
      .filter(c => c.values.meta.added && parseInt(c.id.split(':')[1], 10) > lastIdx)
      .map(c => c.values);
    constraintNodes.push(...localOnly);
  }

  const itemOptions = constraintItemOptions(viewNode);
  const children = constraintNodes.map((constraint, idx) => {
    const constraintId = `${viewNode.id}.constraints:${idx}`;
    const local = readPersistedValues(constraintId);

    return {
      module: constraintNodeName(local || constraint, viewNode),
      superview: viewNode,
      type: 'NSLayoutConstraint',
      id: constraintId,
      properties: {
        constraint,
        itemOptions,
      },
      leaf: true,
    };
  });

  return {
    module: 'Constraints',
    superview: viewNode,
    collapsed: true,
    children,
  };
};

export { transformConstraintPayloadToTree, addNewConstraintToTreeNode, updatedConstraintNodeName };
