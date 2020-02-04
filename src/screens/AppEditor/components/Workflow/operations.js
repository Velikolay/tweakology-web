// @flow
import type { EventHandlerType } from './Events';
import type { DeviceRuntimeData } from '../../../../services/device/types';
import { getEventHandlers, getAllEventHandlers } from './Events';
import { getAllActions } from './Actions';

import { readItem } from '../../../../components/MutableList';

type WorkflowAssets = {
  eventHandlers: { [event_id: string]: EventHandlerType },
  actions: { [action_id: string]: any },
};

export const getWorkflowAssets = (
  viewId: string,
  remote: DeviceRuntimeData,
): WorkflowAssets => {
  const eventHandlers = getEventHandlers(viewId, remote.eventHandlers);
  const actions = Object.values(eventHandlers)
    // https://github.com/facebook/flow/issues/2221
    // $FlowFixMe - Object.values currently has poor flow support
    .flatMap(eventHandler => eventHandler.actions)
    .reduce((map, { id }) => {
      map[id] = readItem(id, 'values'); // eslint-disable-line no-param-reassign
      return map;
    }, {});
  return {
    eventHandlers,
    actions,
  };
};

export const getAllWorkflowAssets = (
  remote: DeviceRuntimeData,
): WorkflowAssets => {
  const eventHandlers = getAllEventHandlers(remote.eventHandlers);
  const actions = getAllActions();
  return {
    eventHandlers,
    actions,
  };
};
