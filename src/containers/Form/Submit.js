import { readPersistedConstraints } from './Persistence/Presistence';
import ConstraintTransformer from '../../Transformers/Constraint';
import getTransformer from '../../Transformers';

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
  const constraintValues = ConstraintTransformer.toPayload(constraints.values);
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
    const formState = window.localStorage.getItem(id);
    if (formState) {
      const state = JSON.parse(formState);
      if (state.type !== 'NSLayoutConstraint' && state.dirty) {
        const transformer = getTransformer(state.type);
        const { frame, ...rest } = state.values;
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