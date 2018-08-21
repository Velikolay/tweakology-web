import React from 'react';

const UIHierarchySceneFooter = props => (
  <div className="ui-hierarchy-scene-footer">
    <div className="submit-button-wrapper">
      <button className="submit-button" onClick={props.onSubmitChanges}>
          Sync
      </button>
    </div>
  </div>
);

export default UIHierarchySceneFooter;
