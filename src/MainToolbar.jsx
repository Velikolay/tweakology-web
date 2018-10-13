import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaSync } from 'react-icons/fa';

import './MainToolbar.css';

const MainToolbar = (props) => {
  const { onSubmitChanges } = props;
  return (
    <div className="main-toolbar">
      <div className="submit-button-wrapper">
        <button className="submit-button" type="button" onClick={onSubmitChanges}>
          <IconContext.Provider value={{ className: 'submit-button-icon' }}>
            <FaSync />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
};

MainToolbar.propTypes = {
  onSubmitChanges: PropTypes.func.isRequired,
};

export default MainToolbar;
