// @flow
import React from 'react';

import type { UIViewNode } from '../../../types';
import type { AnyUIView } from '../../../../../services/device/types';

import Event from './Event';

import { TreeViewNodeShape } from '../../Tree/Shapes';

import './Events.scss';

type EventsProps = {
  activeNode: UIViewNode<AnyUIView>,
};

const Events = ({ activeNode }: EventsProps) => {
  return (
    <div className="Events">
      <div className="Events__title">{`${activeNode.module} Events`}</div>
      <Event />
    </div>
  );
};

Events.propTypes = {
  activeNode: TreeViewNodeShape.isRequired,
};

export default Events;
