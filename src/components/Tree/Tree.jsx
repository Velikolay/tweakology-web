import React from 'react';
import TreeLib from 'react-ui-tree';

import './Tree.scss';

const Tree = props => (
  <div className="Tree">
    <TreeLib {...props} />
  </div>
);

export default Tree;
