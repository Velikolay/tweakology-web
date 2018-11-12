import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaPlus, FaSearch } from 'react-icons/fa';

import './TreeToolbar.css';

const TreeToolbar = props => {
  const { onAddNodeClick } = props;
  return (
    <div className="tree-toolbar">
      <IconContext.Provider value={{ className: 'tree-toolbar-button-icon' }}>
        <button
          className="tree-toolbar-button"
          type="button"
          onClick={onAddNodeClick}
        >
          <FaPlus />
        </button>
        <button
          className="tree-toolbar-button"
          type="button"
          onClick={onAddNodeClick}
        >
          <FaSearch />
        </button>
      </IconContext.Provider>
    </div>
  );
};

TreeToolbar.propTypes = {
  onAddNodeClick: PropTypes.func.isRequired,
};

export default TreeToolbar;
