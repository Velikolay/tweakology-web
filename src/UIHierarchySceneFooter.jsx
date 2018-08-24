import React from 'react';
import PropTypes from 'prop-types';

const UIHierarchySceneFooter = (props) => {
  const { onSubmitChanges } = props;
  return (
    <div className="ui-hierarchy-scene-footer">
      <div className="submit-button-wrapper">
        <button className="submit-button" type="button" onClick={onSubmitChanges}>
          Sync
        </button>
      </div>
    </div>
  );
};

UIHierarchySceneFooter.propTypes = {
  onSubmitChanges: PropTypes.func.isRequired,
};

export default UIHierarchySceneFooter;
