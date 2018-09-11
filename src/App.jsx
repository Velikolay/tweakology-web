import 'isomorphic-fetch';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Split from 'split.js';
import Form from './Forms/Form';
import { submitChanges } from './Forms/Submit';
import { enrichFontsData } from './Utils/Font';
import { transformConstraintPayloadToTree, addNewConstraintToTreeNode, updatedConstraintNodeName } from './Utils/Tree/Constraint';
import toConstraintIndicator from './Utils/ThreeD/Constraint';

import ThreeScene from './Three/ThreeScene';

import UIElementMesh from './UIElementMesh';
import UIElementConstraintLine from './UIElementConstraintLine';
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
        const tree = this.transformPayloadToTree(data, {
          threeD: { baseX: 0, baseY: 0, depth: 0 },
        });
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

  transformPayloadToTree = (uiElement, { threeD: { baseX, baseY, depth } }) => {
    const {
      uid,
      type,
      hierarchyMetadata,
      properties,
      constraints,
      subviews,
    } = uiElement;

    const {
      maxX, minX, maxY, minY,
    } = properties.frame;

    const width = maxX - minX;
    const height = maxY - minY;

    const treeNode = {
      module: type,
      id: uid,
      type,
      hierarchyMetadata,
      properties,
      threeD: {
        x: depth === 0 ? 0 : baseX + minX + width / 2,
        y: depth === 0 ? 0 : baseY - minY - height / 2,
        z: depth,
        width,
        height,
      },
    };

    treeNode.children = [];
    if (subviews) {
      const nextBaseX = baseX + minX - (depth === 0 ? width / 2 : 0);
      const nextBaseY = baseY - minY + (depth === 0 ? height / 2 : 0);
      let depthCounter = depth;
      for (const subview of subviews) {
        depthCounter += 1;
        const threeD = {
          threeD: {
            baseX: nextBaseX,
            baseY: nextBaseY,
            depth: depthCounter,
          },
        };
        treeNode.children.push(this.transformPayloadToTree(subview, threeD));
      }
    }

    if (constraints && constraints.length > 0) {
      treeNode.children.push(transformConstraintPayloadToTree(treeNode, constraints));
    }

    if (treeNode.children.length === 0) {
      treeNode.leaf = true;
    }

    return treeNode;
  }

  treeToMeshProps = (treeNode) => {
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
    const { children, threeD } = treeNode;

    const meshProps = [{
      ...threeD,
      id: treeNode.id,
      imgUrl: `http://nikoivan01m.local:8080/images?path=${treeNode.hierarchyMetadata}`,
      updateTexture: this.updateMesh,
      selected: isSelected(activeNode, treeNode),
      onFocus: onFocusNode && onFocusNode.id === treeNode.id,
    }];
    if (children) {
      for (const childNode of children) {
        if (childNode.type && childNode.type !== 'NSLayoutConstraint') {
          const childrenMeshProps = this.treeToMeshProps(childNode);
          meshProps.push(...childrenMeshProps);
        }
      }
    }
    return meshProps;
  }

  render() {
    const { tree, activeNode } = this.state;
    const meshComponents = this.treeToMeshProps(tree).map(
      meshProps => <UIElementMesh {...meshProps} />,
    );
    if (this.updateMesh) {
      this.updateMesh = false;
    }

    let constraintIndicator = [];
    if (activeNode && activeNode.type === 'NSLayoutConstraint') {
      constraintIndicator = toConstraintIndicator(activeNode).map(
        props => <UIElementConstraintLine {...props} />,
      );
    }
    // const constraintLine = lineProps({
    //   x1: 50, y1: 50, z1: 100, x2: 150, y2: 90, z2: 100,
    // }).map(props => <UIElementConstraintLine {...props} />);

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
        <ThreeScene
          ref={(el) => { this.sceneRef = el; }}
          views={this.treeToMeshProps(tree)}
        />
        {/* <UIHierarchyScene
          ref={(el) => { this.sceneRef = el; }}
          onSubmitChanges={this.onSubmitChanges}
        >
          {meshComponents}
          {constraintIndicator}
        </UIHierarchyScene> */}
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
