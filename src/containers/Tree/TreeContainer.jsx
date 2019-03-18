import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import TreeNode from '../../components/Tree/TreeNode/TreeNode';
import TreeToolbar from '../../components/Tree/TreeToolbar/TreeToolbar';
import TreeEnhancementMenu from '../../components/Tree/TreeEnhancementMenu/TreeEnhancementMenu';
import Tree from '../../components/Tree/Tree';

import { TreeRootNodeShape, TreeNodeShape } from './TreeShapes';

class TreeContainer extends Component {
  constructor(props) {
    super(props);
    const { tree, activeNode, onFocusNode } = this.props;
    this.state = { tree, activeNode, onFocusNode };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  renderNode = node => {
    const { eventHandler } = this.props;
    return (
      <TreeNode
        text={node.module}
        isActive={this.isActive(node)}
        isOnFocus={this.isOnFocus(node)}
        isLeaf={this.isLeaf(node)}
        eventHandler={event => eventHandler(event, node)}
      />
    );
  };

  isLeaf = node => 'leaf' in node;

  isActive = node => {
    const { activeNode } = this.state;
    return activeNode && activeNode.id === node.id;
  };

  isOnFocus = node => {
    const { onFocusNode } = this.state;
    return onFocusNode && onFocusNode.id === node.id;
  };

  onChange = tree => {
    this.setState({
      tree,
    });
  };

  toolbarEventHandler = eventName => {
    if (eventName === 'enhancementclick') {
      const { showTreeEnhancementMenu } = this.state;
      this.setState({ showTreeEnhancementMenu: !showTreeEnhancementMenu });
    }
  };

  render() {
    const { eventHandler } = this.props;
    const { tree, showTreeEnhancementMenu } = this.state;
    return (
      <React.Fragment>
        <Tree
          tree={tree}
          onChange={this.onChange}
          renderNode={this.renderNode}
        />
        <TransitionGroup>
          {showTreeEnhancementMenu ? (
            <CSSTransition
              classNames="TreeEnhancementMenu"
              timeout={{ enter: 100, exit: 100 }}
            >
              <TreeEnhancementMenu
                onItemAdded={item => eventHandler('additem', item)}
              />
            </CSSTransition>
          ) : null}
        </TransitionGroup>
        <TreeToolbar eventHandler={this.toolbarEventHandler} />
      </React.Fragment>
    );
  }
}

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
