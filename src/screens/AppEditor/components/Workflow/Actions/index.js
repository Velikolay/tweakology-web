// @flow
import { readItem, findItemIds } from '../../../../../components/MutableList';

export const getAllActions = (): { string: EventHandler } => {
  const actionIds = findItemIds('Actions');
  return actionIds.reduce((map, id) => {
    map[id] = readItem(id, 'values'); // eslint-disable-line no-param-reassign
    return map;
  }, {});
};

export * from './Action';
