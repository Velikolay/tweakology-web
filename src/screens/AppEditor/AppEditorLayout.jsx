import React from 'react';
import PropTypes from 'prop-types';
import Split from 'react-split';

import { withDeviceContext } from '../../contexts/DeviceContext';
import { DevicesShape } from '../../components/Tree/DeviceMenu/Shapes';
import { TreeRootNodeShape, TreeNodeShape } from '../../containers/Tree/Shapes';

import Tree from '../../containers/Tree/Tree';
import MainToolbar from '../../components/MainToolbar/MainToolbar';
import SceneComponent from '../../containers/Scene/Scene';
import FormComponent from '../../containers/Form/Form';
import SceneReducer from './reducers/scene';
import FormReducer from './reducers/form';

import './AppEditorLayout.scss';

const componentWithReducer = (Comp, mapStateToProps) => props => (
  <Comp {...mapStateToProps(props)} />
);

const Scene = componentWithReducer(
  SceneComponent,
  SceneReducer.mapStateToProps,
);
const Form = withDeviceContext(
  React.memo(componentWithReducer(FormComponent, FormReducer.mapStateToProps)),
);

const AppEditorLayout = props => {
  const {
    devices,
    tree,
    activeNode,
    onFocusNode,
    treeEventHandler,
    sceneEventHandler,
    formEventHandler,
    onSubmitChanges,
  } = props;

  return (
    <Split
      className="App"
      sizes={[20, 60, 20]}
      minSize={[250, 300, 250]}
      gutterSize={2}
      expandToMin
    >
      <div className="tree-section">
        <Tree
          devices={devices}
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
          <Form activeNode={activeNode} eventHandler={formEventHandler} />
        ) : null}
      </div>
    </Split>
  );
};

AppEditorLayout.propTypes = {
  devices: DevicesShape,
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
  treeEventHandler: PropTypes.func.isRequired,
  sceneEventHandler: PropTypes.func.isRequired,
  formEventHandler: PropTypes.func.isRequired,
  onSubmitChanges: PropTypes.func.isRequired,
};

AppEditorLayout.defaultProps = {
  devices: [],
  activeNode: null,
  onFocusNode: null,
};

export default AppEditorLayout;
