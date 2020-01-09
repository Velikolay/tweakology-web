// @flow
import type { EventHandlerType } from './types';
import {
  readList,
  readItem,
  findItemIds,
} from '../../../../../components/MutableList';

const processList = (list: any[]): string[] =>
  list.filter(({ status }) => status === 'enabled').map(({ id }) => id);

const generateObjects = (ids: string[]): { string: EventHandlerType } =>
  ids.reduce((map, id) => {
    // eslint-disable-next-line no-param-reassign
    map[id] = {
      events: readItem(id, 'values'),
      actions: processList(readList(id) || []),
    };
    return map;
  }, {});

export const getEventHandlerIds = (viewId: string): string[] => {
  const eventHandlerIds = readList(`Events.${viewId}`);
  return eventHandlerIds ? processList(eventHandlerIds) : [];
};

export const getEventHandlers = (
  viewId: string,
): { string: EventHandlerType } => {
  const eventHandlerIds = getEventHandlerIds(viewId);
  return generateObjects(eventHandlerIds);
};

export const getAllEventHandlers = (): { string: EventHandlerType } => {
  const eventHandlerIds = findItemIds('EventHandlers');
  return generateObjects(eventHandlerIds);
};
