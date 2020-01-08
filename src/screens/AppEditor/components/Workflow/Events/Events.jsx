// @flow
import React from 'react';

import type { UIViewNode } from '../../../types';
import type { AnyUIView } from '../../../../../services/device/types';

import {
  NewEventHandler,
  EventHandlerItem,
  genEventHandlerId,
} from './EventHandler';
import MutableList from '../../../../../components/MutableList';

import { TreeViewNodeShape } from '../../Tree/Shapes';

import './Events.scss';

type EventsProps = {
  activeNode: UIViewNode<AnyUIView>,
};

const Events = ({ activeNode }: EventsProps) => {
  const id = `Events.${activeNode.id}`;
  return (
    <div className="Events">
      <div className="Events__title">{`${activeNode.module} Events`}</div>
      <MutableList
        id={id}
        key={id}
        items={[]}
        itemStyles="Events__item"
        itemComponent={EventHandlerItem}
        newItemComponent={NewEventHandler}
        genId={genEventHandlerId}
      />
    </div>
  );
};

Events.propTypes = {
  activeNode: TreeViewNodeShape.isRequired,
};

export default Events;
