import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tree from 'react-ui-tree';

import TreeNode from './Node/Node';
import TreeEnhancementMenu from './EnhancementMenu/EnhancementMenu';
import TreeToolbar from './Toolbar/Toolbar';

import { TreeRootNodeShape, TreeNodeShape } from './Shapes';

import './Tree.scss';

require('react-ui-tree/dist/react-ui-tree.css');

const TreeContainer = props => {
  const { tree, activeNode, onFocusNode, eventHandler } = props;
  const [showTreeEnhancementMenu, setShowTreeEnhancementMenu] = useState(false);

  const isLeaf = node => 'leaf' in node;

  const isActive = node => activeNode && activeNode.id === node.id;

  const isOnFocus = node => onFocusNode && onFocusNode.id === node.id;

  const internalEventHandler = (event, node) => {
    if (event === 'enhancementclick') {
      setShowTreeEnhancementMenu(!showTreeEnhancementMenu);
    } else {
      eventHandler(event, node);
    }
  };

  const renderNode = node => (
    <TreeNode
      text={node.module}
      isActive={isActive(node)}
      isOnFocus={isOnFocus(node)}
      isLeaf={isLeaf(node)}
      eventHandler={event => internalEventHandler(event, node)}
    />
  );

  return (
    <React.Fragment>
      <div className="Tree">
        <Tree tree={tree} renderNode={renderNode} />
      </div>
      <TransitionGroup>
        {showTreeEnhancementMenu ? (
          <CSSTransition
            classNames="TreeEnhancementMenu"
            timeout={{ enter: 100, exit: 100 }}
          >
            <TreeEnhancementMenu eventHandler={internalEventHandler} />
          </CSSTransition>
        ) : null}
      </TransitionGroup>
      <TreeToolbar eventHandler={internalEventHandler} />
    </React.Fragment>
  );
};

TreeContainer.propTypes = {
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
  eventHandler: PropTypes.func,
};

TreeContainer.defaultProps = {
  activeNode: null,
  onFocusNode: null,
  eventHandler: () => {},
};

export default TreeContainer;
