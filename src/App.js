import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import ViewForm from './Forms/ViewForm.js';
import FrameForm from './Forms/Frame.js';
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
      activeNode: null,
      onFocusNode: null
    }

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeFocus = this.onNodeFocus.bind(this);
  }

  componentDidMount() {
    Split([ReactDOM.findDOMNode(this.refs.tree), ReactDOM.findDOMNode(this.refs.scene), ReactDOM.findDOMNode(this.refs.config)], {
      sizes: [20, 60, 20],
      minSize: [200, 300, 200],
      gutterSize: 5,
    });

    fetch(APP_INSPECTOR_EP)
      .then(response => response.json())
      .then(data => this.setState({ hierarchyData: data }));
  }

  onNodeClick = node => {
    this.setState({ activeNode: node });
  }

  onNodeFocus = node => {
    if (!this.state.activeNode || node['id'] !== this.state.activeNode['id']) {
      this.setState({ onFocusNode: node });
    } else {
      this.setState({ onFocusNode: null });
    }
  }

  onNodeFocusOut = node => {
    if (this.state.onFocusNode && node['id'] === this.state.onFocusNode['id']) {
      this.setState({ onFocusNode: null });
    }
  }

  transformPayloadToTree = uiElement => {
    let treeNode = {
      module: uiElement['type'],
      id: uiElement['hierarchyMetadata'],
      properties: uiElement['properties']
    }
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
          tree={this.transformPayloadToTree(this.state.hierarchyData)}
          activeNode={this.state.activeNode}
          onNodeClick={this.onNodeClick}
          onNodeFocus={this.onNodeFocus}
          onNodeFocusOut={this.onNodeFocusOut}
        />
        <UIHierarchyScene ref="scene">
            {meshComponents}
        </UIHierarchyScene>
        <div ref="config" className="config-pane">
          {this.state.activeNode !== null? (
            <FrameForm 
              x={this.state.activeNode.properties.frame.minX}
              y={this.state.activeNode.properties.frame.minY}
              width={this.state.activeNode.properties.frame.maxX - this.state.activeNode.properties.frame.minX}
              height={this.state.activeNode.properties.frame.maxY - this.state.activeNode.properties.frame.minY}
            />
            ): 
            null
          }
        </div>
      </div>
    );
  }
}

export default App;
