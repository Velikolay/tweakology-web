import React, { Component } from 'react';

import DeviceConnector from '../../services/device/connector';
import DeviceContext from '../../contexts/DeviceContext';

import PayloadTransformer from './data-transformers/tree/payload';
import { buildChangeSet } from '../../containers/Form/Submit';

import { fontDataEnrichment } from '../../utils/font';
import { addConstraintToNode, updatedConstraintNodeName } from './tree-manip';

import AppEditorLayout from './AppEditorLayout';

class AppEditor extends Component {
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
          fonts: fontDataEnrichment(fonts),
        };
      })
      .catch(err => console.log(err));

  updateTree = () =>
    this.deviceConnector
      .fetchTree()
      .then(payload => {
        const { activeNode } = this.state;
        const revision = Date.now();
        const tree = PayloadTransformer.toTree(
          payload,
          revision,
          this.deviceConnector.endpoint,
        );
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
    activeNode.updatedProperties = values;
    if (type === 'NSLayoutConstraint') {
      activeNode.module = updatedConstraintNodeName(activeNode);
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

    const insertItemConfig = [
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
      .submitChanges('test', insertItemConfig)
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
      addConstraintToNode(node);
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

  render() {
    const { tree, activeNode, onFocusNode } = this.state;
    return (
      <DeviceContext.Provider value={this.deviceContext}>
        <AppEditorLayout
          tree={tree}
          activeNode={activeNode}
          onFocusNode={onFocusNode}
          treeEventHandler={this.treeEventHandler}
          sceneEventHandler={this.sceneEventHandler}
          onSubmitChanges={this.onSubmitChanges}
          onFormUpdate={this.onFormUpdate}
          onFormSelect={this.onFormSelect}
        />
      </DeviceContext.Provider>
    );
  }
}

export default AppEditor;
