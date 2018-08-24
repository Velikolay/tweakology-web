import 'isomorphic-fetch';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Split from 'split.js';
import Form from './Forms/Form';
import { submitChanges } from './Forms/Submit';
import { enrichFontsData } from './Utils/Font';
import { transformConstraintPayloadToTree, addNewConstraintToTreeNode, updatedConstraintNodeName } from './Utils/Tree/Constraint';

import UIElementMesh from './UIElementMesh';
import UIHierarchyScene from './UIHierarchyScene';
import UIHierarchyTree from './UIHierarchyTree';


import './App.css';

require('react-ui-tree/dist/react-ui-tree.css');

const APP_INSPECTOR_EP = 'http://nikoivan01m.local:8080/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: {
        module: 'Loading...',
        leaf: true,
      },
      activeNode: null,
      onFocusNode: null,
    };

    this.dragging = false;

    this.onSubmitChanges = this.onSubmitChanges.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeFocus = this.onNodeFocus.bind(this);
    this.onNodeFocusOut = this.onNodeFocus.bind(this);
    this.onNodeMouseDown = this.onNodeMouseDown.bind(this);
    this.onNodeMouseUp = this.onNodeMouseUp.bind(this);
  }

  componentDidMount() {
    Split([
      ReactDOM.findDOMNode(this.treeRef), // eslint-disable-line react/no-find-dom-node
      ReactDOM.findDOMNode(this.sceneRef), // eslint-disable-line react/no-find-dom-node
      ReactDOM.findDOMNode(this.configRef), // eslint-disable-line react/no-find-dom-node
    ], {
      sizes: [20, 60, 20],
      minSize: [200, 300, 200],
      gutterSize: 5,
    });

    this.updateTree();

    fetch(`${APP_INSPECTOR_EP}fonts`)
      .then(response => response.json())
      .then((fontsData) => {
        this.systemMetadata = {
          fonts: enrichFontsData(fontsData),
        };
      });
  }

  updateTree = () => {
    fetch(APP_INSPECTOR_EP)
      .then(response => response.json())
      .then((data) => {
        const { activeNode } = this.state;
        this.updateMesh = true;
        const tree = this.transformPayloadToTree(data);
        const updatedState = {
          tree,
        };
        if (!activeNode) {
          updatedState.activeNode = tree;
        }
        this.setState(updatedState);
      });
  }

  onSubmitChanges = () => {
    const { tree } = this.state;
    submitChanges(tree, this.systemMetadata).then(() => this.updateTree());
    // window.localStorage.clear();
  }

  onFormChange = (id, type, values) => {
    if (type === 'NSLayoutConstraint') {
      const { activeNode } = this.state;
      this.updateMesh = true;
      activeNode.updatedProperties = { constraint: values };
      activeNode.module = updatedConstraintNodeName(activeNode);
      this.setState({
        activeNode,
      });
    }
  }

  onClickAdd = (node) => {
    addNewConstraintToTreeNode(node);
    this.setState({ activeNode: node });
  }

  onNodeClick = (node) => {
    if (node.id) {
      this.setState({ activeNode: node });
    }
  }

  onNodeFocus = (node, event) => {
    if (!this.dragging) {
      const { activeNode } = this.state;
      if (node.id && (!activeNode || node.id !== activeNode.id)) {
        this.setState({ onFocusNode: node });
      } else {
        this.setState({ onFocusNode: null });
      }
    }
  }

  onNodeFocusOut = (node, event) => {
    const { onFocusNode } = this.state;
    if (!this.dragging && onFocusNode && node.id === onFocusNode.id) {
      this.setState({ onFocusNode: null });
    }
  }

  onNodeMouseDown = (node, event) => {
    this.dragging = true;
  }

  onNodeMouseUp = (node, event) => {
    this.dragging = false;
  }

  transformPayloadToTree = (uiElement) => {
    const treeNode = {
      module: uiElement.type,
      id: uiElement.uid,
      type: uiElement.type,
      hierarchyMetadata: uiElement.hierarchyMetadata,
      properties: uiElement.properties,
    };

    treeNode.children = [];
    if ('subviews' in uiElement) {
      for (const subview of uiElement.subviews) {
        treeNode.children.push(this.transformPayloadToTree(subview));
      }
    }

    if (uiElement.constraints && uiElement.constraints.length > 0) {
      treeNode.children.push(transformConstraintPayloadToTree(treeNode, uiElement.constraints));
    }

    if (treeNode.children.length === 0) {
      treeNode.leaf = true;
    }

    return treeNode;
  }

  treeToMeshProps = (treeNode, baseX, baseY, depth) => {
    if (Object.keys(treeNode).length === 0 || treeNode.module === 'Loading...') {
      return [];
    }

    const isSelected = (activeNode, node) => {
      let selected = activeNode && activeNode.id === node.id;
      if (!selected && activeNode.type === 'NSLayoutConstraint') {
        const constraint = 'updatedProperties' in activeNode ? activeNode.updatedProperties.constraint : activeNode.properties.constraint;

        if (constraint.first && constraint.first.item.value === node.id) {
          selected = true;
        }

        if (constraint.second && constraint.second.item.value === node.id) {
          selected = true;
        }
      }
      return selected;
    };

    const { activeNode, onFocusNode } = this.state;
    const { properties } = treeNode;
    const { frame } = properties;
    const width = frame.maxX - frame.minX;
    const height = frame.maxY - frame.minY;
    const meshProps = [{
      x: depth === 0 ? 0 : baseX + frame.minX + width / 2,
      y: depth === 0 ? 0 : baseY - frame.minY - height / 2,
      z: depth,
      width,
      height,
      imgUrl: `http://nikoivan01m.local:8080/images?path=${treeNode.hierarchyMetadata}`,
      updateTexture: this.updateMesh,
      selected: isSelected(activeNode, treeNode),
      onFocus: onFocusNode && onFocusNode.id === treeNode.id,
    }];
    if ('children' in treeNode) {
      const nextBaseX = baseX + frame.minX - (depth === 0 ? width / 2 : 0);
      const nextBaseY = baseY - frame.minY + (depth === 0 ? height / 2 : 0);
      let depthCounter = depth;

      for (const childNode of treeNode.children) {
        if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
          depthCounter += 1;
          const childrenMeshProps = this.treeToMeshProps(
            childNode,
            nextBaseX,
            nextBaseY,
            depthCounter,
          );
          meshProps.push(...childrenMeshProps);
        }
      }
    }
    return meshProps;
  }

  render() {
    const { tree, activeNode } = this.state;
    const meshComponents = this.treeToMeshProps(tree, 0, 0, 0).map(
      meshProps => <UIElementMesh {...meshProps} />,
    );
    if (this.updateMesh) {
      this.updateMesh = false;
    }

    return (
      <div className="App">
        <UIHierarchyTree
          ref={(el) => { this.treeRef = el; }}
          tree={tree}
          activeNode={activeNode}
          onClickAdd={this.onClickAdd}
          onNodeClick={this.onNodeClick}
          onNodeFocus={this.onNodeFocus}
          onNodeFocusOut={this.onNodeFocusOut}
          onNodeMouseDown={this.onNodeMouseDown}
          onNodeMouseUp={this.onNodeMouseUp}
        />
        <UIHierarchyScene
          ref={(el) => { this.sceneRef = el; }}
          onSubmitChanges={this.onSubmitChanges}
        >
          {meshComponents}
        </UIHierarchyScene>
        <div ref={(el) => { this.configRef = el; }} className="config-pane">
          { activeNode !== null ? (
            <Form
              id={activeNode.id}
              type={activeNode.type}
              formData={activeNode.properties}
              systemMetadata={this.systemMetadata}
              onFormChange={this.onFormChange}
            />
          ) : null
          }
        </div>
      </div>
    );
  }
}

export default App;
