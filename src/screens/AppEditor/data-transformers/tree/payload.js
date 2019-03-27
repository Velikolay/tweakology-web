import PersistenceService from '../../../../services/persistence';
import getTransformer from '../form';

import { readPersistedConstraints } from '../../../../containers/Form/Presistence';

import { getConstraintItemOptions, constraintNodeName } from '../../tree-manip';

const constraintPayloadToTree = (node, constraints) => {
  const NSLayoutConstraintTransformer = getTransformer('NSLayoutConstraint');
  const lastIdx = constraints.length - 1;
  const constraintsByView = readPersistedConstraints();
  if (node.id in constraintsByView) {
    const localOnly = constraintsByView[node.id]
      .filter(
        c => c.values.meta.added && parseInt(c.id.split(':')[1], 10) > lastIdx,
      )
      .map(c => c.values)
      .map(NSLayoutConstraintTransformer.toPayload);
    constraints.push(...localOnly);
  }

  const itemOptions = getConstraintItemOptions(node);
  const children = constraints.map((properties, idx) => {
    const id = `${node.id}.constraints:${idx}`;
    const updatedProperties = NSLayoutConstraintTransformer.toPayload(
      PersistenceService.read(id, 'values'),
    );

    const cNode = {
      superview: node,
      type: 'NSLayoutConstraint',
      id,
      properties: {
        ...properties,
        itemOptions,
      },
      updatedProperties,
      leaf: true,
    };
    cNode.module = constraintNodeName(cNode);
    return cNode;
  });

  return {
    module: 'Constraints',
    superview: node,
    collapsed: true,
    children,
  };
};

const PayloadTransformer = {
  toTree: (node, revision, endpoint) => {
    const {
      uid: { value: id, kind },
      name,
      type,
      properties,
      constraints,
      subviews,
    } = node;

    const treeNode = {
      module: kind === 0 ? name : id,
      id,
      name,
      type,
      revision,
      imgUrl: `${endpoint}/images/${id}`,
      properties,
      updatedProperties: getTransformer(type).toPayload(
        PersistenceService.read(id, 'values'),
      ),
    };

    treeNode.children = [];
    if (subviews) {
      for (const subview of subviews) {
        const subtree = PayloadTransformer.toTree(subview, revision, endpoint);
        subtree.superview = treeNode;
        treeNode.children.push(subtree);
      }
    }

    if (constraints && constraints.length > 0) {
      treeNode.children.push(constraintPayloadToTree(treeNode, constraints));
    }

    if (treeNode.children.length === 0) {
      treeNode.leaf = true;
    }

    return treeNode;
  },
};

export default PayloadTransformer;
