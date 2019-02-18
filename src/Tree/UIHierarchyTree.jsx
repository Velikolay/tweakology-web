import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tree from 'react-ui-tree';

import { TreeRootNodeShape, TreeNodeShape } from './TreeShapes';

import './UIHierarchyTree.css';

class UIHierarchyTree extends Component {
  constructor(props) {
    super(props);
    const { tree, activeNode, onFocusNode } = this.props;
    this.state = { tree, activeNode, onFocusNode };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  renderNode = node => {
    const {
      onNodeClick,
      onNodeFocus,
      onNodeFocusOut,
      onNodeMouseDown,
      onNodeMouseUp,
      onClickAdd,
    } = this.props;
    return (
      <div
        className={cx('container', {
          'is-active': this.isActive(node),
          'is-onfocus': this.isOnFocus(node) && !this.isActive(node),
        })}
      >
        {this.isActive(node) && !('leaf' in node) ? (
          <button
            type="button"
            className="add-button"
            onClick={() => onClickAdd(node)}
          >
            add
          </button>
        ) : (
          ''
        )}
        <div
          className="text"
          onClick={() => onNodeClick(node)}
          onMouseEnter={() => onNodeFocus(node)}
          onMouseLeave={() => onNodeFocusOut(node)}
          onMouseDown={() => onNodeMouseDown(node)}
          onMouseUp={() => onNodeMouseUp(node)}
        >
          {node.module}
        </div>
      </div>
    );
  };

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

  updateTree = () => {
    const { tree } = this.state;
    tree.children.push({ module: 'test' });
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

UIHierarchyTree.propTypes = {
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
  onNodeClick: PropTypes.func.isRequired,
  onNodeFocus: PropTypes.func.isRequired,
  onNodeFocusOut: PropTypes.func.isRequired,
  onNodeMouseDown: PropTypes.func.isRequired,
  onNodeMouseUp: PropTypes.func.isRequired,
  onClickAdd: PropTypes.func.isRequired,
};

UIHierarchyTree.defaultProps = {
  activeNode: null,
  onFocusNode: null,
};

export default UIHierarchyTree;
