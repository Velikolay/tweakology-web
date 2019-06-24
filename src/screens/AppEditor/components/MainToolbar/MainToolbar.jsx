import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaSync } from 'react-icons/fa';

import './MainToolbar.scss';

const MainToolbar = props => {
  const { onSubmitChanges } = props;
  return (
    <div className="MainToolbar">
      <div className="MainToolbar__submitContainer">
        <button
          className="MainToolbar__submitButton"
          type="button"
          onClick={onSubmitChanges}
        >
          <IconContext.Provider
            value={{ className: 'MainToolbar__submitButton__icon' }}
          >
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
