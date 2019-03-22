import PersistenceService from '../../services/persistence';
import { readPersistedConstraints } from './Presistence';
import NSLayoutConstraintTransformer from '../../transformers/NSLayoutConstraint';
import getTransformer from '../../transformers';

const treeToFormIds = uiElement => {
  const treeNode = [uiElement.id];
  if ('leaf' in uiElement && uiElement.leaf === true) {
    return treeNode;
  }
  for (const child of uiElement.children) {
    treeNode.push(...treeToFormIds(child));
  }

  return treeNode;
};

const constraintToPayload = constraints => {
  const constraintValues = NSLayoutConstraintTransformer.toPayload(
    constraints.values,
  );
  return {
    idx: parseInt(constraints.id.split(':')[1], 10),
    ...constraintValues,
  };
};

const buildChangeSet = (tree, device) => {
  const ids = treeToFormIds(tree);
  const changeSet = [];

  const constraints = readPersistedConstraints();
  ids.forEach(id => {
    const form = PersistenceService.read(id);
    if (form) {
      if (form.type !== 'NSLayoutConstraint' && form.dirty) {
        const transformer = getTransformer(form.type);
        const { frame, ...rest } = form.values;
        const change = {
          operation: 'modify',
          view: {
            id,
            properties: transformer.toPayload(rest, device),
            frame,
          },
        };
        if (id in constraints) {
          change.view.constraints = constraints[id].map(constraintToPayload);
          delete constraints[id];
        }
        changeSet.push(change);
      }
    }
  });

  Object.entries(constraints).forEach(([id, viewConstraints]) => {
    changeSet.push({
      operation: 'modify',
      view: {
        id,
        constraints: viewConstraints.map(constraintToPayload),
      },
    });
  });

  return changeSet;
};

export { buildChangeSet };
