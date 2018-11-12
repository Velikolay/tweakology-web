import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import Split from 'split.js';

import SystemContext from './Context/SystemContext';
import Form from './Forms/Form';

import { submitChanges } from './Forms/Submit';
import { enrichFontsData } from './Utils/Font';
import {
  transformConstraintPayloadToTree,
  addNewConstraintToTreeNode,
  updatedConstraintNodeName,
} from './Utils/Tree/Constraint';
import toThreeViews from './Three/View';
import toThreeConstraintIndicator from './Three/Constraint';
import UIHierarchyScene from './Three/UIHierarchyScene';
import UIHierarchyTree from './Tree/UIHierarchyTree';

import MainToolbar from './MainToolbar';
import TreeToolbar from './TreeToolbar';
import NewViewMenu from './NewViewMenu';

import './App.css';
import { readPersistedValues } from './Forms/Persistence/Presistence';

require('react-ui-tree/dist/react-ui-tree.css');

const APP_INSPECTOR_EP = 'http://NIKOIVAN02M.local:8080/';

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
      showNewNodeMenu: false,
    };

    this.formikBag = null;
    this.nodeDragging = false;

    this.onFormUpdate = this.onFormUpdate.bind(this);
    this.onFormSelect = this.onFormSelect.bind(this);
    this.onSubmitChanges = this.onSubmitChanges.bind(this);
    this.onAddNodeClick = this.onAddNodeClick.bind(this);
    this.onNodeAdded = this.onNodeAdded.bind(this);
    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeFocus = this.onNodeFocus.bind(this);
    this.onNodeFocusOut = this.onNodeFocus.bind(this);
    this.onNodeMouseDown = this.onNodeMouseDown.bind(this);
    this.onNodeMouseUp = this.onNodeMouseUp.bind(this);
  }

  componentDidMount() {
    Split(
      [
        ReactDOM.findDOMNode(this.treeRef), // eslint-disable-line react/no-find-dom-node
        ReactDOM.findDOMNode(this.middleSectionRef), // eslint-disable-line react/no-find-dom-node
        ReactDOM.findDOMNode(this.configRef), // eslint-disable-line react/no-find-dom-node
      ],
      {
        sizes: [20, 60, 20],
        minSize: [200, 300, 200],
        gutterSize: 5,
      },
    );

    this.updateTree();

    fetch(`${APP_INSPECTOR_EP}fonts`)
      .then(response => response.json())
      .then(fontsData => {
        this.systemContext = {
          fonts: enrichFontsData(fontsData),
        };
      });
  }

  updateTree = () => {
    fetch(APP_INSPECTOR_EP)
      .then(response => response.json())
      .then(data => {
        const { activeNode } = this.state;
        const revision = Date.now();
        const tree = this.transformPayloadToTree(data, revision);
        const updatedState = {
          tree,
          activeNode:
            (activeNode && this.findNode(tree, activeNode.id)) || tree,
        };
        this.setState(updatedState);
      });
  };

  onSubmitChanges = () => {
    const { tree } = this.state;
    submitChanges(tree, this.systemContext).then(() => this.updateTree());
    // window.localStorage.clear();
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

  onClickAdd = node => {
    addNewConstraintToTreeNode(node);
    this.setState({ activeNode: node });
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

    fetch('http://NIKOIVAN02M.local:8080/tweaks/test', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(insertNewViewConfig),
    }).then(() => this.updateTree());
  };

  onNodeClick = node => {
    if (node.id) {
      this.setState({ activeNode: node });
    }
  };

  onNodeFocus = (node, event) => {
    if (!this.nodeDragging) {
      const { activeNode } = this.state;
      if (node.id && (!activeNode || node.id !== activeNode.id)) {
        this.setState({ onFocusNode: node });
      } else {
        this.setState({ onFocusNode: null });
      }
    }
  };

  onNodeFocusOut = (node, event) => {
    const { onFocusNode } = this.state;
    if (!this.nodeDragging && onFocusNode && node.id === onFocusNode.id) {
      this.setState({ onFocusNode: null });
    }
  };

  onNodeMouseDown = (node, event) => {
    this.nodeDragging = true;
  };

  onNodeMouseUp = (node, event) => {
    this.nodeDragging = false;
  };

  on3DObjectDrag = (state, obj) => {
    const {
      activeNode: { id },
    } = this.state;
    if (this.formikBag) {
      const { setFieldValue } = this.formikBag;
      if (state === 'drag') {
        const {
          id: objId,
          position: { x, y },
        } = obj;
        if (id === objId) {
          setFieldValue('frame.x', Math.trunc(x));
          setFieldValue('frame.y', Math.trunc(y));
        }
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
      type,
      hierarchyMetadata,
      properties,
      constraints,
      subviews,
    } = uiElement;

    const treeNode = {
      module: kind === 0 ? type : id,
      id,
      type,
      revision,
      hierarchyMetadata,
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
      <div className="App">
        <SystemContext.Provider value={this.systemContext}>
          <div
            ref={el => {
              this.treeRef = el;
            }}
            className="tree-section"
          >
            <UIHierarchyTree
              tree={tree}
              activeNode={activeNode}
              onClickAdd={this.onClickAdd}
              onNodeClick={this.onNodeClick}
              onNodeFocus={this.onNodeFocus}
              onNodeFocusOut={this.onNodeFocusOut}
              onNodeMouseDown={this.onNodeMouseDown}
              onNodeMouseUp={this.onNodeMouseUp}
            />
            <CSSTransitionGroup
              transitionName="sliding"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {showNewNodeMenu ? (
                <NewViewMenu onNodeAdded={this.onNodeAdded} />
              ) : null}
            </CSSTransitionGroup>
            <TreeToolbar onAddNodeClick={this.onAddNodeClick} />
          </div>
          <div
            ref={el => {
              this.middleSectionRef = el;
            }}
            className="middle-section"
          >
            <UIHierarchyScene
              views={toThreeViews({ tree, activeNode, onFocusNode })}
              constraintIndicators={constraintIndicators}
              onDragHandler={this.on3DObjectDrag}
            />
            <MainToolbar onSubmitChanges={this.onSubmitChanges} />
          </div>
          <div
            ref={el => {
              this.configRef = el;
            }}
            className="config-section"
          >
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
        </SystemContext.Provider>
      </div>
    );
  }
}

export default App;
