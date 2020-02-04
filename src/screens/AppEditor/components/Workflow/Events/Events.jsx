// @flow
import React, { useContext } from 'react';

import type { UIViewNode } from '../../../types';
import type { UIControl } from '../../../../../services/device/types';

import RuntimeContext from '../../../contexts/RuntimeContext';

import {
  NewEventHandler,
  EventHandlerItem,
  genEventHandlerId,
} from './EventHandler';
import MutableList from '../../../../../components/MutableList';

import { TreeViewNodeShape } from '../../Tree/Shapes';

import './Events.scss';

type EventsProps = {
  activeNode: UIViewNode<UIControl>,
};

const Events = ({ activeNode }: EventsProps) => {
  const {
    properties: { eventHandlers },
  } = activeNode;
  const { eventHandlers: remoteEventHandlers } = useContext(RuntimeContext);
  if (Array.isArray(eventHandlers)) {
    const id = `Events.${activeNode.id}`;
    const eventHandlerItems = eventHandlers
      .filter(ehid => ehid in remoteEventHandlers)
      .map(ehid => ({
        id: ehid,
        data: remoteEventHandlers[ehid],
      }));

    return (
      <div className="Events">
        <div className="Events__title">{`${activeNode.module} Events`}</div>
        <MutableList
          id={id}
          key={id}
          items={eventHandlerItems}
          itemStyles="Events__item"
          itemComponent={EventHandlerItem}
          newItemComponent={NewEventHandler}
          genId={genEventHandlerId}
        />
      </div>
    );
  }
  return null;
};

Events.propTypes = {
  activeNode: TreeViewNodeShape.isRequired,
};

export default Events;
