import React, { Component } from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Split from 'react-split';

import DeviceConnector from './Device/Connector';
import SystemContext from './Context/SystemContext';

import Form from './Forms/Form';
import { buildChangeSet } from './Forms/Submit';
import { readPersistedValues } from './Forms/Persistence/Presistence';

import { enrichFontsData } from './Utils/Font';
import {
  transformConstraintPayloadToTree,
  addNewConstraintToTreeNode,
  updatedConstraintNodeName,
} from './Utils/Tree/Constraint';
import toThreeViews from './Three/View';
import toThreeConstraintIndicator from './Three/Constraint';
import UIScene from './containers/Scene/UIScene';
import UITree from './containers/Tree/UITree';

import MainToolbar from './MainToolbar';
import TreeToolbar from './TreeToolbar';
import NewViewMenu from './NewViewMenu';

import './App.css';

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
      showNewNodeMenu: false,
    };

    this.formikBag = null;
    this.nodeDragging = false;

    this.onFormUpdate = this.onFormUpdate.bind(this);
    this.onFormSelect = this.onFormSelect.bind(this);
    this.onSubmitChanges = this.onSubmitChanges.bind(this);
    this.onAddNodeClick = this.onAddNodeClick.bind(this);
    this.onNodeAdded = this.onNodeAdded.bind(this);
    this.uiTreeEventHandler = this.uiTreeEventHandler.bind(this);
    this.uiSceneEventHandler = this.uiSceneEventHandler.bind(this);
  }

  componentDidMount() {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.on('agent-update', (event, device) => {
      const connected = this.deviceConnector.isConnected();
      this.deviceConnector.updateRemoteDevice(device);
      if (!connected && this.deviceConnector.isConnected()) {
        this.updateTree();
        this.updateSystemContext();
      }
    });
    ipcRenderer.send('app-component-mounted');
  }

  updateSystemContext = () =>
    this.deviceConnector
      .fetchSystemData()
      .then(({ fonts }) => {
        this.systemContext = {
          fonts: enrichFontsData(fonts),
        };
      })
      .catch(err => console.log(err));

  updateTree = () =>
    this.deviceConnector
      .fetchUITree()
      .then(uiTree => {
        const { activeNode } = this.state;
        const revision = Date.now();
        const tree = this.transformPayloadToTree(uiTree, revision);
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
    const changeSet = buildChangeSet(tree, this.systemContext);
    this.deviceConnector
      .submitChanges('test', changeSet)
      .then(() => this.updateTree())
      .then(() => localStorage.clear())
      .catch(err => console.log(err));
  };

  onFormUpdate = (id, type, values) => {
    const { activeNode } = this.state;
    if (type === 'NSLayoutConstraint') {
      activeNode.updatedProperties = { constraint: values };
      activeNode.module = updatedConstraintNodeName(activeNode);
    } else {
      activeNode.updatedProperties = values;
    }
    this.setState({ activeNode });
  };

  onFormSelect = formik => {
    this.formikBag = formik;
  };

  onAddNodeClick = () => {
    const { showNewNodeMenu } = this.state;
    this.setState({ showNewNodeMenu: !showNewNodeMenu });
  };

  onNodeAdded = ({ id, type, ...rest }) => {
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

  uiTreeEventHandler = (eventName, node) => {
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
  };

  uiSceneEventHandler = (eventName, obj) => {
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
      updatedProperties: readPersistedValues(id),
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
    const { tree, activeNode, onFocusNode, showNewNodeMenu } = this.state;

    const constraintIndicators = [];
    if (activeNode && activeNode.type === 'NSLayoutConstraint') {
      constraintIndicators.push(toThreeConstraintIndicator(activeNode));
    }
    // const constraintLine = lineProps({
    //   x1: 50, y1: 50, z1: 100, x2: 150, y2: 90, z2: 100,
    // }).map(props => <UIElementConstraintLine {...props} />);

    return (
      <SystemContext.Provider value={this.systemContext}>
        <Split
          className="App"
          sizes={[20, 60, 20]}
          minSize={[250, 300, 250]}
          gutterSize={4}
          expandToMin
        >
          <div className="tree-section">
            <UITree
              tree={tree}
              activeNode={activeNode}
              onFocusNode={onFocusNode}
              eventHandler={this.uiTreeEventHandler}
            />
            <TransitionGroup>
              {showNewNodeMenu ? (
                <CSSTransition
                  classNames="sliding"
                  timeout={{ enter: 100, exit: 100 }}
                >
                  <NewViewMenu onNodeAdded={this.onNodeAdded} />
                </CSSTransition>
              ) : null}
            </TransitionGroup>
            <TreeToolbar onAddNodeClick={this.onAddNodeClick} />
          </div>
          <div className="middle-section">
            <UIScene
              tree={toThreeViews({ tree, activeNode, onFocusNode })}
              constraintIndicators={constraintIndicators}
              eventHandler={this.uiSceneEventHandler}
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
      </SystemContext.Provider>
    );
  }
}

export default App;
