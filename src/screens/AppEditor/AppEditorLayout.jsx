import React from 'react';
import PropTypes from 'prop-types';
import Split from 'react-split';

import { TreeRootNodeShape, TreeNodeShape } from '../../containers/Tree/Shapes';

import Tree from '../../containers/Tree/Tree';
import Scene from './Adaptors/Scene';
import Form from './Adaptors/Form';
import MainToolbar from '../../components/MainToolbar/MainToolbar';

import './AppEditorLayout.scss';

const AppEditorLayout = props => {
  const {
    tree,
    activeNode,
    onFocusNode,
    treeEventHandler,
    sceneEventHandler,
    onSubmitChanges,
    onFormUpdate,
    onFormSelect,
  } = props;

  return (
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
          eventHandler={treeEventHandler}
        />
      </div>
      <div className="middle-section">
        <Scene
          tree={tree}
          activeNode={activeNode}
          onFocusNode={onFocusNode}
          eventHandler={sceneEventHandler}
        />
        <MainToolbar onSubmitChanges={onSubmitChanges} />
      </div>
      <div className="config-section">
        {activeNode !== null ? (
          <Form
            activeNode={activeNode}
            onFormUpdate={onFormUpdate}
            onFormSelect={onFormSelect}
          />
        ) : null}
      </div>
    </Split>
  );
};

AppEditorLayout.propTypes = {
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
  treeEventHandler: PropTypes.func.isRequired,
  sceneEventHandler: PropTypes.func.isRequired,
  onSubmitChanges: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onFormSelect: PropTypes.func.isRequired,
};

AppEditorLayout.defaultProps = {
  activeNode: null,
  onFocusNode: null,
};

export default AppEditorLayout;
