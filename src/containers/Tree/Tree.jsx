import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import TreeNode from '../../components/Tree/Node/Node';
import TreeToolbar from '../../components/Tree/Toolbar/Toolbar';
import TreeEnhancementMenu from '../../components/Tree/EnhancementMenu/EnhancementMenu';
import Tree from '../../components/Tree/Tree';

import { TreeRootNodeShape, TreeNodeShape } from './Shapes';

class TreeContainer extends Component {
  constructor(props) {
    super(props);
    const { tree, activeNode, onFocusNode } = this.props;
    this.state = { tree, activeNode, onFocusNode };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  renderNode = node => (
    <TreeNode
      text={node.module}
      isActive={this.isActive(node)}
      isOnFocus={this.isOnFocus(node)}
      isLeaf={this.isLeaf(node)}
      eventHandler={event => this.internalEventHandler(event, node)}
    />
  );

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

  internalEventHandler = (event, node) => {
    if (event === 'enhancementclick') {
      const { showTreeEnhancementMenu } = this.state;
      this.setState({ showTreeEnhancementMenu: !showTreeEnhancementMenu });
    } else {
      const { eventHandler } = this.props;
      eventHandler(event, node);
    }
  };

  render() {
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
              <TreeEnhancementMenu eventHandler={this.internalEventHandler} />
            </CSSTransition>
          ) : null}
        </TransitionGroup>
        <TreeToolbar eventHandler={this.internalEventHandler} />
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
