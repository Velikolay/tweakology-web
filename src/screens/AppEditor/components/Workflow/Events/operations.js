// @flow
import type { EventHandlerType } from './types';
import type { EventHandlersData } from '../../../../../services/device/types';
import {
  readList,
  readItem,
  findItemIds,
} from '../../../../../components/MutableList';

const processList = (list: any[]): string[] =>
  list.filter(({ status }) => status === 'enabled').map(({ id }) => id);

const generateObjects = (
  ids: string[],
  remote: EventHandlersData,
): { string: EventHandlerType } =>
  ids.reduce((map, id) => {
    const eh = readItem(id, 'values') || remote[id];
    if (eh) {
      // eslint-disable-next-line no-param-reassign
      map[id] = {
        id,
        events: eh.events,
        actions: processList(readList(id) || []),
      };
    } else {
      console.log(`ERROR: EventHandler ${id} doesn't exist`);
    }
    return map;
  }, {});

export const getEventHandlerIds = (viewId: string): string[] => {
  const eventHandlerIds = readList(`Events.${viewId}`);
  return eventHandlerIds ? processList(eventHandlerIds) : [];
};

export const getEventHandlers = (
  viewId: string,
  remote: EventHandlersData,
): { string: EventHandlerType } => {
  const eventHandlerIds = getEventHandlerIds(viewId);
  return generateObjects(eventHandlerIds, remote);
};

export const getAllEventHandlers = (
  remote: EventHandlersData,
): { string: EventHandlerType } => {
  const eventHandlerIds = findItemIds('EventHandlers', true);
  return generateObjects(eventHandlerIds, remote);
};
