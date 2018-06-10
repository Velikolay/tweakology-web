import React, { Component } from 'react';
import cx from 'classnames';
import Tree from 'react-ui-tree';

class UIHierarchyTree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeNode: this.props.activeNode,
      tree: this.props.tree
    }
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
        activeNode: nextProps.activeNode,
        tree: nextProps.tree
      });
  }

  renderNode = node => {
    return (
      <div className={cx('container', {
        'is-active': this.state.activeNode && node.id === this.state.activeNode.id
      })}>
        { this.state.activeNode && node.id === this.state.activeNode.id && !('leaf' in node) ?
          <button className='add-button'>
            add view
          </button>
          :
          ""
        }
        <div
          className='text'
          onClick={this.props.onNodeClick.bind(null, node)}
          onMouseEnter={this.props.onNodeFocus.bind(null, node)}
          onMouseLeave={this.props.onNodeFocusOut.bind(null, node)}
        >
          {node.module}
        </div>
      </div>
    );
  };

  handleChange = tree => {
    this.setState({
      tree: tree
    });
  };

  updateTree = () => {
    const { tree } = this.state;
    tree.children.push({ module: 'test' });
    this.setState({
      tree: tree
    });
  };

  render() {
    return (
      <div className="tree-view">
        <Tree
          paddingLeft={20}
          tree={this.state.tree}
          onChange={this.handleChange}
          isNodeCollapsed={this.isNodeCollapsed}
          renderNode={this.renderNode}
        />
      </div>
    );
  }
}

export default UIHierarchyTree;
