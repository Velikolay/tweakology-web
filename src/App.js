import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ViewForm from './Forms/ViewForm.js';
import { submitChanges } from './Forms/Submit.js';
import { transformFontName } from './Utils/Font.js';

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

    fetch(APP_INSPECTOR_EP)
      .then(response => response.json())
      .then(data => {
        const tree = this.transformPayloadToTree(data);
        this.setState({
          hierarchyData: data,
          tree: tree,
          activeNode: tree
        })
      }
    );

    fetch(APP_INSPECTOR_EP + 'fonts')
      .then(response => response.json())
      .then(data => {
        Object.keys(data.styles).map((key, index) =>
          data.styles[key] = data.styles[key].map(transformFontName)
        );
        this.systemMetadata = {
          fonts: data
        };
      });
  }

  onSubmitChanges = () => {
    submitChanges(this.state.tree);
    // window.localStorage.clear();
  }

  onNodeClick = node => {
    this.setState({ activeNode: node });
  }

  onNodeFocus = (node, event) => {
    if (!this.dragging) {
      if (!this.state.activeNode || node.id !== this.state.activeNode.id) {
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
      id: uiElement['hierarchyMetadata'],
      type: uiElement['type'],
      properties: uiElement['properties']
    };
    if ('subviews' in uiElement) {
      treeNode['children'] = [];
      for (let subview of uiElement.subviews) {
        treeNode.children.push(this.transformPayloadToTree(subview));
      }
    } else {
      treeNode['leaf'] = true;
    }
    return treeNode;
  }

  transformPayloadToMeshProps = (uiElement, baseX, baseY, depth) => {
    if (Object.keys(uiElement).length === 0) {
      return [];
    }
    
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
      selected: this.state.activeNode && this.state.activeNode['id'] === uiElement['hierarchyMetadata'] ? true: false,
      onFocus: this.state.onFocusNode && this.state.onFocusNode['id'] === uiElement['hierarchyMetadata'] ? true: false
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

    return (
      <div className="App">
        <UIHierarchyTree
          ref="tree"
          tree={this.state.tree}
          activeNode={this.state.activeNode}
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
            <ViewForm
              id={this.state.activeNode.id}
              type={this.state.activeNode.type}
              viewProps={this.state.activeNode.properties}
              systemMetadata={this.systemMetadata} />
            ): null
          }
        </div>
      </div>
    );
  }
}

export default App;
