import { getFontName } from '../Utils/Font.js';

const _treeToFormIds = uiElement => {
  let treeNode = [uiElement['id']];
  if ('leaf' in uiElement && uiElement['leaf'] === true) {
    return treeNode;
  } else {
    for (let child of uiElement.children) {
      treeNode.push.apply(treeNode, _treeToFormIds(child));
    }
  }
  return treeNode;
}

const submitChanges = (tree, systemMetadata) => {
  const ids = _treeToFormIds(tree);
  let changeSet = [];
  for (let id of ids) {
    const formState = window.localStorage.getItem(id);
    if (formState) {
      const state = JSON.parse(formState);
      if (state.dirty === true) {
        enrichValues(state.values, systemMetadata);
        changeSet.push({
          operation: 'modify',
          view: {
            id: id,
            properties: state.values,
            frame: state.values.frame
          }
        });
      }
    }
  }

  return fetch('http://nikoivan01m.local:8080/tweaks/test', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(changeSet)
   });
}

const enrichValues = (values, systemMetadata) => {
  Object.keys(values).forEach(key => {
    const valueObject = values[key];
    if (isDict(valueObject)) {
      if (key === 'font') {
        valueObject.fontName = getFontName(valueObject['familyName'], valueObject['fontStyle'], systemMetadata['fonts']['names']);
      } else {
        enrichValues(valueObject, systemMetadata)
      }
    }
  });
}

const isDict = v => {
  return typeof v==='object' && v!==null && !(v instanceof Array) && !(v instanceof Date);
}

export { submitChanges };