import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Split from 'react-split';
import { FaProjectDiagram, FaMobileAlt, FaFolder } from 'react-icons/fa';

import TabBar, { Tab } from '../../components/TabBar';

import DeviceContext from './contexts/DeviceContext';
import { DevicesShape, DeviceShape } from './components/DeviceMenu/Shapes';
import { TreeRootNodeShape, TreeNodeShape } from './components/Tree/Shapes';

import Tree from './components/Tree';
import DeviceMenu from './components/DeviceMenu';
import MainToolbar from './components/MainToolbar';
import SceneComponent from './components/Scene';
import Workflow from './components/Workflow';
import FormComponent from './components/Form';
import SceneReducer from './reducers/scene';
import FormReducer from './reducers/form';

import './AppEditorLayout.scss';

const componentWithReducer = (Comp, mapStateToProps) => props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Comp {...mapStateToProps(props, useContext(DeviceContext))} />
);

const Scene = componentWithReducer(
  SceneComponent,
  SceneReducer.mapStateToProps,
);
const Form = React.memo(
  componentWithReducer(FormComponent, FormReducer.mapStateToProps),
);

const AppEditorLayout = props => {
  const {
    connectedDevice,
    devices,
    tree,
    activeNode,
    onFocusNode,
    treeEventHandler,
    sceneEventHandler,
    formEventHandler,
    deviceEventHandler,
    onSubmitChanges,
  } = props;

  const [showWorkflow, setShowWorkflow] = useState(false);

  return (
    <Split
      className="App"
      sizes={[20, 60, 20]}
      minSize={[250, 300, 250]}
      gutterSize={2}
      expandToMin
    >
      <div className="left-section">
        <TabBar light>
          <Tab id="tree" title={<FaProjectDiagram />}>
            <Tree
              tree={tree}
              activeNode={activeNode}
              onFocusNode={onFocusNode}
              eventHandler={treeEventHandler}
            />
          </Tab>
          <Tab id="devices" title={<FaMobileAlt />}>
            <DeviceMenu
              connectedDevice={connectedDevice}
              devices={devices}
              eventHandler={deviceEventHandler}
            />
          </Tab>
          <Tab id="tweaks" title={<FaFolder />} />
        </TabBar>
      </div>
      <div className="middle-section">
        <Scene
          hidden={showWorkflow}
          tree={tree}
          activeNode={activeNode}
          onFocusNode={onFocusNode}
          eventHandler={sceneEventHandler}
        />
        {showWorkflow ? <Workflow activeNode={activeNode} /> : null}
        <MainToolbar
          onSubmitChanges={onSubmitChanges}
          onShowWorkflow={() => setShowWorkflow(!showWorkflow)}
        />
      </div>
      <div className="right-section">
        {activeNode !== null ? (
          <Form activeNode={activeNode} eventHandler={formEventHandler} />
        ) : null}
      </div>
    </Split>
  );
};

AppEditorLayout.propTypes = {
  connectedDevice: DeviceShape,
  devices: DevicesShape,
  tree: TreeRootNodeShape.isRequired,
  activeNode: TreeNodeShape,
  onFocusNode: TreeNodeShape,
  treeEventHandler: PropTypes.func.isRequired,
  sceneEventHandler: PropTypes.func.isRequired,
  formEventHandler: PropTypes.func.isRequired,
  deviceEventHandler: PropTypes.func.isRequired,
  onSubmitChanges: PropTypes.func.isRequired,
};

AppEditorLayout.defaultProps = {
  connectedDevice: null,
  devices: [],
  activeNode: null,
  onFocusNode: null,
};

export default AppEditorLayout;
