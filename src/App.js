import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Form from './Forms/Form';
import { submitChanges } from './Forms/Submit.js';
import { enrichFontsData } from './Utils/Font.js';
import { transformConstraintPayloadToTree, addNewConstraintToTreeNode, updatedConstraintNodeName } from './Utils/Tree/Constraint.js';

import UIElementMesh from './UIElementMesh.js';
import UIHierarchyScene from './UIHierarchyScene.js';
import UIHierarchyTree from './UIHierarchyTree.js';

import Split from 'split.js'

import './App.css';

require("react-ui-tree/dist/react-ui-tree.css");

let APP_INSPECTOR_EP = 'http://nikoivan01m.local:8080/';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hierarchyData: {},
      tree: {
        module: 'Loading...',
        leaf: true
      },
      activeNode: null,
      onFocusNode: null,
    }

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
    Split([ReactDOM.findDOMNode(this.refs.tree), ReactDOM.findDOMNode(this.refs.scene), ReactDOM.findDOMNode(this.refs.config)], {
      sizes: [20, 60, 20],
      minSize: [200, 300, 200],
      gutterSize: 5,
    });

    this.updateHierarchyData();

    fetch(APP_INSPECTOR_EP + 'fonts')
      .then(response => response.json())
      .then(fontsData => {
        this.systemMetadata = {
          fonts: enrichFontsData(fontsData)
        };
      });
  }

  updateHierarchyData = () => {
    fetch(APP_INSPECTOR_EP)
      .then(response => response.json())
      .then(data => {
        this.updateMesh = true;
        const tree = this.transformPayloadToTree(data);
        const updatedState = {
          hierarchyData: data,
          tree: tree
        };
        if (!this.state.activeNode) {
          updatedState.activeNode = tree;
        }
        this.setState(updatedState);
      }
    );
  }

  onSubmitChanges = () => {
    submitChanges(this.state.tree, this.systemMetadata).then(response =>
      this.updateHierarchyData()
    );
    // window.localStorage.clear();
  }

  onFormChange = (id, type, values) => {
    if (type === 'NSLayoutConstraint') {
      console.log(values);
      this.state.activeNode.module = updatedConstraintNodeName(values, this.state.activeNode)
      this.setState({
        activeNode: this.state.activeNode
      });
    }
  }

  onClickAdd = node => {
    addNewConstraintToTreeNode(node);
    this.setState({ activeNode: node });
  }

  onNodeClick = node => {
    if (node.id) {
      this.setState({ activeNode: node });
    }
  }

  onNodeFocus = (node, event) => {
    if (!this.dragging) {
      if (node.id && (!this.state.activeNode || node.id !== this.state.activeNode.id)) {
        this.setState({ onFocusNode: node });
      } else {
        this.setState({ onFocusNode: null });
      }
    }
  }

  onNodeFocusOut = (node, event) => {
    if (!this.dragging && this.state.onFocusNode && node.id === this.state.onFocusNode.id) {
      this.setState({ onFocusNode: null });
    }
  }

  onNodeMouseDown = (node, event) => {
    this.dragging = true;
  }

  onNodeMouseUp = (node, event) => {
    this.dragging = false;
  }

  transformPayloadToTree = uiElement => {
    let treeNode = {
      module: uiElement['type'],
      id: uiElement['uid'],
      type: uiElement['type'],
      properties: uiElement['properties']
    };

    treeNode.children = [];
    if ('subviews' in uiElement) {
      for (let subview of uiElement.subviews) {
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

  transformPayloadToMeshProps = (uiElement, baseX, baseY, depth) => {
    if (Object.keys(uiElement).length === 0) {
      return [];
    }

    const isSelected = (activeNode, uiElement) => {
      let selected = activeNode && activeNode.id === uiElement.uid;
      if (!selected && activeNode.type === 'NSLayoutConstraint') {
        const constraint = activeNode.properties.constraint;
        if (constraint.first && constraint.first.item.value === uiElement.uid) {
          selected = true;
        }
        if (constraint.second && constraint.second.item.value === uiElement.uid) {
          selected = true;
        }
      }
      return selected;
    };

    const properties = uiElement['properties'];
    const frame = properties['frame'];
    const width = frame['maxX'] - frame['minX'];
    const height = frame['maxY'] - frame['minY'];
    let meshProps = [{
      x: depth === 0? 0: baseX + frame['minX'] + width/2,
      y: depth === 0? 0: baseY - frame['minY'] - height/2,
      z: depth,
      width: width,
      height: height,
      imgUrl: 'http://nikoivan01m.local:8080/images?path=' + uiElement['hierarchyMetadata'],
      updateTexture: this.updateMesh,
      selected: isSelected(this.state.activeNode, uiElement),
      onFocus: this.state.onFocusNode && this.state.onFocusNode.id === uiElement.uid
    }];
    if ('subviews' in uiElement) {
      const nextBaseX = baseX + frame['minX'] - (depth === 0? width/2: 0);
      const nextBaseY = baseY - frame['minY'] + (depth === 0? height/2: 0);
      for (let subview of uiElement.subviews) {
        const childrenMeshProps = this.transformPayloadToMeshProps(subview, nextBaseX, nextBaseY, depth + 1);
        meshProps.push(...childrenMeshProps);
      }
    }
    return meshProps;
  }

  render() {
    var meshComponents = this.transformPayloadToMeshProps(this.state.hierarchyData, 0, 0, 0).map(function(meshProps) {
      return <UIElementMesh {...meshProps} />;
    });
    if (this.updateMesh) {
      this.updateMesh = false;
    }

    return (
      <div className="App">
        <UIHierarchyTree
          ref="tree"
          tree={this.state.tree}
          activeNode={this.state.activeNode}
          onClickAdd={this.onClickAdd}
          onNodeClick={this.onNodeClick}
          onNodeFocus={this.onNodeFocus}
          onNodeFocusOut={this.onNodeFocusOut}
          onNodeMouseDown={this.onNodeMouseDown}
          onNodeMouseUp={this.onNodeMouseUp}
        />
        <UIHierarchyScene ref="scene" onSubmitChanges={this.onSubmitChanges}>
            {meshComponents}
        </UIHierarchyScene>
        <div ref="config" className="config-pane">
          { this.state.activeNode !== null ? (
            <Form
              id={this.state.activeNode.id}
              type={this.state.activeNode.type}
              formData={this.state.activeNode.properties}
              systemMetadata={this.systemMetadata}
              onFormChange={this.onFormChange} />
            ): null
          }
        </div>
      </div>
    );
  }
}

export default App;
