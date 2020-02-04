// @flow
import { readItem, findItemIds } from '../../../../../components/MutableList';

// eslint-disable-next-line import/prefer-default-export
export const getAllActions = (): { string: EventHandler } => {
  const actionIds = findItemIds('Actions');
  return actionIds.reduce((map, id) => {
    const action = readItem(id, 'values');
    if (action) {
      // eslint-disable-next-line no-param-reassign
      map[id] = { id, type: action.type, args: action.args };
    }
    return map;
  }, {});
};
