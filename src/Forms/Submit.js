import { getFontName } from '../Utils/Font';
import { readPersistedConstraints } from './Persistence/Presistence';
import ConstraintTransformer from '../Transformers/Constraints';

const _treeToFormIds = (uiElement) => {
  const treeNode = [uiElement.id];
  if ('leaf' in uiElement && uiElement.leaf === true) {
    return treeNode;
  }
  for (const child of uiElement.children) {
    treeNode.push(..._treeToFormIds(child));
  }

  return treeNode;
};

const constraintToPayload = (constraints) => {
  const constraintValues = ConstraintTransformer.toPayload(constraints.values);
  return {
    idx: parseInt(constraints.id.split(':')[1], 10),
    ...constraintValues,
  };
};

const submitChanges = (tree, systemMetadata) => {
  const ids = _treeToFormIds(tree);
  const changeSet = [];

  const constraints = readPersistedConstraints();
  console.log(constraints);
  for (const id of ids) {
    const formState = window.localStorage.getItem(id);
    if (formState) {
      const state = JSON.parse(formState);
      if (state.type !== 'NSLayoutConstraint' && state.dirty) {
        enrichValues(state.values, systemMetadata);
        const change = {
          operation: 'modify',
          view: {
            id,
            properties: state.values,
            frame: state.values.frame,
          },
        };
        if (id in constraints) {
          change.view.constraints = constraints[id].map(constraintToPayload);
          delete constraints[id];
        }
        changeSet.push(change);
      }
    }
  }

  for (const id in constraints) {
    changeSet.push({
      operation: 'modify',
      view: {
        id,
        constraints: constraints[id].map(constraintToPayload),
      },
    });
  }

  console.log(changeSet);
  return fetch('http://nikoivan01m.local:8080/tweaks/test', {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changeSet),
  }).then((res) => {
    localStorage.clear();
    return res;
  });
};

const enrichValues = (values, systemMetadata) => {
  Object.keys(values).forEach((key) => {
    const valueObject = values[key];
    if (isDict(valueObject)) {
      if (key === 'font') {
        valueObject.fontName = getFontName(valueObject.familyName, valueObject.fontStyle, systemMetadata.fonts.names);
      } else {
        enrichValues(valueObject, systemMetadata);
      }
    }
  });
};

const isDict = v => typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);

export { submitChanges };
