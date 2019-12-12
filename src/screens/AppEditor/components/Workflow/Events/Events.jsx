// @flow
import React from 'react';

import type { UIViewNode } from '../../../types';
import type { AnyUIView } from '../../../../../services/device/types';

import { NewEventHandler, EventHandlerItem } from './EventHandler';
import MutableList from '../../../../../components/MutableList';

import { TreeViewNodeShape } from '../../Tree/Shapes';

import './Events.scss';

type EventsProps = {
  activeNode: UIViewNode<AnyUIView>,
};

const Events = ({ activeNode }: EventsProps) => {
  return (
    <div className="Events">
      <div className="Events__title">{`${activeNode.module} Events`}</div>
      <MutableList
        id={`Events.${activeNode.id}`}
        items={[]}
        itemComponent={EventHandlerItem}
        newItemComponent={NewEventHandler}
      />
    </div>
  );
};

Events.propTypes = {
  activeNode: TreeViewNodeShape.isRequired,
};

export default Events;
