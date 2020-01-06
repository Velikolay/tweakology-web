// @flow
import Action, { NewAction, ActionItem, genActionId } from './Action';
import { readItem, findItems } from '../../../../../components/MutableList';

export const getAllActions = (): { string: EventHandler } => {
  const actionIds = findItems('Actions');
  return actionIds.reduce((map, id) => {
    map[id] = readItem(id); // eslint-disable-line no-param-reassign
    return map;
  }, {});
};

export { NewAction, ActionItem, genActionId };

export default Action;
