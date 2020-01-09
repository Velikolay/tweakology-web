// @flow
import { readItem, findItemIds } from '../../../../../components/MutableList';

// eslint-disable-next-line import/prefer-default-export
export const getAllActions = (): { string: EventHandler } => {
  const actionIds = findItemIds('Actions');
  return actionIds.reduce((map, id) => {
    map[id] = readItem(id, 'values'); // eslint-disable-line no-param-reassign
    return map;
  }, {});
};
