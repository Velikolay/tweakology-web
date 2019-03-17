import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tree from 'react-ui-tree';

import TreeNode from '../../components/Tree/TreeNode/TreeNode';

import { TreeRootNodeShape, TreeNodeShape } from './TreeShapes';

import './UITree.scss';

class UITree extends Component {
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

  handleChange = tree => {
    this.setState({
      tree,
    });
  };

  render() {
    const { tree } = this.state;
    return (
      <div className="tree-view">
        <Tree
          tree={tree}
          onChange={this.handleChange}
          isNodeCollapsed={this.isNodeCollapsed}
          renderNode={this.renderNode}
        />
      </div>
    );
  }
}

UITree.propTypes = {
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
  eventHandler: PropTypes.func,
};

UITree.defaultProps = {
  activeNode: null,
  onFocusNode: null,
  eventHandler: () => {},
};

export default UITree;
