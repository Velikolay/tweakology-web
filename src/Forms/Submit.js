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

const submitChanges = tree => {
  const ids = _treeToFormIds(tree);
  let changeSet = [];
  for (let id of ids) {
    const formState = window.localStorage.getItem(id);
    if (formState) {
      const state = JSON.parse(formState);
      if (state.dirty === true) {
        changeSet.push({
          operation: 'modify',
          view: {
            id: id,
            props: state.values,
          }
        });
      }
    }
  }

  return fetch('http://nikoivan01m.local:8080/tweaks/test', {
    method: 'put',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(changeSet)
   });
}



export { submitChanges };