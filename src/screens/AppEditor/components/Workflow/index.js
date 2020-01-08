// @flow
import Workflow from './Workflow';
import type { EventHandlerType } from './Events';
import { getEventHandlers, getAllEventHandlers } from './Events';
import { getAllActions } from './Actions';

import { readItem } from '../../../../components/MutableList';

type WorkflowAssets = {
  eventHandlers: { string: EventHandlerType },
  actions: { string: any },
};

export const getWorkflowAssets = (viewId: string): WorkflowAssets => {
  const eventHandlers = getEventHandlers(viewId);
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

export const getAllWorkflowAssets = (): WorkflowAssets => {
  const eventHandlers = getAllEventHandlers();
  const actions = getAllActions();
  return {
    eventHandlers,
    actions,
  };
};

export { getEventHandlerIds } from './Events';

export default Workflow;
