import React, { Component } from 'react';
import Split from 'react-split';

import PersistenceService from './services/persistence';
import DeviceConnector from './services/device/connector';

import DeviceContext from './contexts/DeviceContext';

import { buildChangeSet } from './containers/Form/Submit';

import { enrichFontsData } from './Utils/Font';
import {
  transformConstraintPayloadToTree,
  addNewConstraintToTreeNode,
  updatedConstraintNodeName,
} from './Utils/Tree/Constraint';

import TreeTransformer from './containers/Scene/transformers/tree';
import ConstraintTransformer from './containers/Scene/transformers/constraint';

import Tree from './containers/Tree/Tree';
import Scene from './containers/Scene/Scene';
import Form from './containers/Form/Form';

import MainToolbar from './components/MainToolbar/MainToolbar';

import './App.scss';

require('react-ui-tree/dist/react-ui-tree.css');

class App extends Component {
  constructor(props) {
    super(props);

    this.deviceConnector = new DeviceConnector();

    this.state = {
      tree: {
        module: 'Loading...',
        leaf: true,
      },
      activeNode: null,
      onFocusNode: null,
    };

    this.formikBag = null;
    this.nodeDragging = false;

    this.onFormUpdate = this.onFormUpdate.bind(this);
    this.onFormSelect = this.onFormSelect.bind(this);
    this.onSubmitChanges = this.onSubmitChanges.bind(this);
    this.onItemAdded = this.onItemAdded.bind(this);
    this.treeEventHandler = this.treeEventHandler.bind(this);
    this.sceneEventHandler = this.sceneEventHandler.bind(this);
  }

  componentDidMount() {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.on('agent-update', (event, device) => {
      const connected = this.deviceConnector.isConnected();
      this.deviceConnector.updateRemoteDevice(device);
      if (!connected && this.deviceConnector.isConnected()) {
        this.updateTree();
        this.updateDeviceContext();
      }
    });
    ipcRenderer.send('app-component-mounted');
  }

  updateDeviceContext = () =>
    this.deviceConnector
      .fetchSystemData()
      .then(({ fonts }) => {
        this.deviceContext = {
          fonts: enrichFontsData(fonts),
        };
      })
      .catch(err => console.log(err));

  updateTree = () =>
    this.deviceConnector
      .fetchTree()
      .then(payload => {
        const { activeNode } = this.state;
        const revision = Date.now();
        const tree = this.transformPayloadToTree(payload, revision);
        const updatedState = {
          tree,
          activeNode:
            (activeNode && this.findNode(tree, activeNode.id)) || tree,
        };
        this.setState(updatedState);
      })
      .catch(err => console.log(err));

  onSubmitChanges = () => {
    const { tree } = this.state;
    const changeSet = buildChangeSet(tree, this.deviceContext);
    this.deviceConnector
      .submitChanges('test', changeSet)
      .then(() => this.updateTree())
      .then(() => localStorage.clear())
      .catch(err => console.log(err));
  };

  onFormUpdate = (id, type, values) => {
    const { activeNode } = this.state;
    if (type === 'NSLayoutConstraint') {
      console.log(activeNode.updatedProperties);
      activeNode.updatedProperties = values;
      activeNode.module = updatedConstraintNodeName(activeNode);
    } else {
      activeNode.updatedProperties = values;
    }
    this.setState({ activeNode });
  };

  onFormSelect = formik => {
    this.formikBag = formik;
  };

  onItemAdded = ({ id, type, ...rest }) => {
    const { activeNode } = this.state;
    const { children, id: superview } =
      ['UIButton', 'UILabel', 'UIImageView'].indexOf(activeNode.type) === -1
        ? activeNode
        : activeNode.superview;
    const index =
      children && children[children.length - 1].module === 'Constraints'
        ? children.length - 1
        : children.length;

    const insertNewViewConfig = [
      {
        operation: 'insert',
        view: {
          id,
          superview,
          index,
          type,
          ...rest,
        },
      },
    ];
    this.deviceConnector
      .submitChanges('test', insertNewViewConfig)
      .then(() => this.updateTree())
      .catch(err => console.log(err));
  };

  treeEventHandler = (eventName, node) => {
    if (eventName === 'select') {
      if (node.id) {
        this.setState({ activeNode: node });
      }
    }
    if (eventName === 'add') {
      addNewConstraintToTreeNode(node);
      this.setState({ activeNode: node });
    }
    if (eventName === 'mouseup') {
      this.nodeDragging = false;
    }
    if (eventName === 'mousedown') {
      this.nodeDragging = true;
    }
    if (eventName === 'hoveron') {
      if (!this.nodeDragging) {
        const { activeNode } = this.state;
        if (node.id && (!activeNode || node.id !== activeNode.id)) {
          this.setState({ onFocusNode: node });
        } else {
          this.setState({ onFocusNode: null });
        }
      }
    }
    if (eventName === 'hoveroff') {
      const { onFocusNode } = this.state;
      if (!this.nodeDragging && onFocusNode && node.id === onFocusNode.id) {
        this.setState({ onFocusNode: null });
      }
    }
    if (eventName === 'additem') {
      this.onItemAdded(node);
    }
  };

  sceneEventHandler = (eventName, obj) => {
    const { activeNode } = this.state;
    if (this.formikBag) {
      const { setFieldValue } = this.formikBag;
      if (eventName === 'drag') {
        const {
          position: { x, y },
        } = obj;
        if (activeNode.id === obj.id) {
          setFieldValue('frame.x', Math.trunc(x));
          setFieldValue('frame.y', Math.trunc(y));
        }
      }
      if (eventName === 'select') {
        const { tree } = this.state;
        this.setState({ activeNode: this.findNode(tree, obj.id) });
      }
      if (eventName === 'hoveron') {
        const { tree } = this.state;
        this.setState({ onFocusNode: this.findNode(tree, obj.id) });
      }
    }
  };

  findNode = (tree, id) => {
    if (id) {
      const { id: nodeId, children } = tree;
      if (nodeId && nodeId === id) {
        return tree;
      }
      if (children) {
        for (const subtree of children) {
          const node = this.findNode(subtree, id);
          if (node) return node;
        }
      }
    }
    return null;
  };

  transformPayloadToTree = (uiElement, revision) => {
    const {
      uid: { value: id, kind },
      name,
      type,
      properties,
      constraints,
      subviews,
    } = uiElement;

    const treeNode = {
      module: kind === 0 ? name : id,
      id,
      name,
      type,
      revision,
      imgUrl: `${this.deviceConnector.endpoint}/images/${id}`,
      properties,
      updatedProperties: PersistenceService.read(id, 'values'),
    };

    treeNode.children = [];
    if (subviews) {
      for (const subview of subviews) {
        const subtree = this.transformPayloadToTree(subview, revision);
        subtree.superview = treeNode;
        treeNode.children.push(subtree);
      }
    }

    if (constraints && constraints.length > 0) {
      treeNode.children.push(
        transformConstraintPayloadToTree(treeNode, constraints),
      );
    }

    if (treeNode.children.length === 0) {
      treeNode.leaf = true;
    }

    return treeNode;
  };

  render() {
    const { tree, activeNode, onFocusNode } = this.state;

    const constraintIndicators = [];
    if (activeNode && activeNode.type === 'NSLayoutConstraint') {
      constraintIndicators.push(ConstraintTransformer.toScene(activeNode));
    }
    return (
      <DeviceContext.Provider value={this.deviceContext}>
        <Split
          className="App"
          sizes={[20, 60, 20]}
          minSize={[250, 300, 250]}
          gutterSize={4}
          expandToMin
        >
          <div className="tree-section">
            <Tree
              tree={tree}
              activeNode={activeNode}
              onFocusNode={onFocusNode}
              eventHandler={this.treeEventHandler}
            />
          </div>
          <div className="middle-section">
            <Scene
              tree={TreeTransformer.toScene({ tree, activeNode, onFocusNode })}
              constraintIndicators={constraintIndicators}
              eventHandler={this.sceneEventHandler}
            />
            <MainToolbar onSubmitChanges={this.onSubmitChanges} />
          </div>
          <div className="config-section">
            {activeNode !== null ? (
              <Form
                id={activeNode.id}
                type={activeNode.type}
                formData={activeNode.properties}
                onFormUpdate={this.onFormUpdate}
                onFormSelect={this.onFormSelect}
              />
            ) : null}
          </div>
        </Split>
      </DeviceContext.Provider>
    );
  }
}

export default App;
