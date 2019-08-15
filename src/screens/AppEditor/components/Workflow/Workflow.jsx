import React from 'react';
import TabBar, { Tab } from '../../../../components/TabBar';

import './Workflow.scss';

const Workflow = props => {
  return (
    <div className="Workflow">
      <TabBar>
        <Tab id="events" title="Events" />
        <Tab id="actions" title="Actions" />
        <Tab id="attributes" title="Attributes" />
      </TabBar>
    </div>
  );
};

export default Workflow;
