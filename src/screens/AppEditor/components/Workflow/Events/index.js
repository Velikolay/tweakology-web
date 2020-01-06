// @flow
import Events from './Events';
import {
  readList,
  readItem,
  findItems,
} from '../../../../../components/MutableList';

export type EventHandler = {
  events: string[],
  actions: any[],
};

const processList = (list: any[]): string[] =>
  list.filter(({ status }) => status === 'enabled').map(({ id }) => id);

const generateObjects = (ids: string[]): { string: EventHandler } =>
  ids.reduce((map, id) => {
    // eslint-disable-next-line no-param-reassign
    map[id] = {
      events: readItem(id),
      actions: processList(readList(id)),
    };
    return map;
  }, {});

export const getEventHandlerIds = (viewId: string): string[] => {
  const eventHandlerIds = readList(`Events.${viewId}`);
  return eventHandlerIds ? processList(eventHandlerIds) : [];
};

export const getEventHandlers = (viewId: string): { string: EventHandler } => {
  const eventHandlerIds = getEventHandlerIds(viewId);
  return generateObjects(eventHandlerIds);
};

export const getAllEventHandlers = (): { string: EventHandler } => {
  const eventHandlerIds = findItems('EventHandlers');
  return generateObjects(eventHandlerIds);
};

export default Events;
