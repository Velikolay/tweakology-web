// @flow
import React from 'react';

import type { UIViewNode } from '../../types';
import type { AnyUIView } from '../../../../services/device/types';

import TabBar, { Tab } from '../../../../components/TabBar';
import Events from './Events';

import './Workflow.scss';

type WorkflowProps = {
  activeNode: UIViewNode<AnyUIView>,
};

const Workflow = (props: WorkflowProps) => {
  return (
    <div className="Workflow">
      <TabBar>
        <Tab id="events" title="Events">
          <Events {...props} />
        </Tab>
        <Tab id="actions" title="Actions" />
        <Tab id="attributes" title="Attributes" />
      </TabBar>
    </div>
  );
};

export default Workflow;
