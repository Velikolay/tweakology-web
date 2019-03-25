import React from 'react';
import TreeLib from 'react-ui-tree';

import './Tree.scss';

require('react-ui-tree/dist/react-ui-tree.css');

const Tree = props => (
  <div className="Tree">
    <TreeLib {...props} />
  </div>
);

export default Tree;
