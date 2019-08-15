import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaSync, FaScrewdriver } from 'react-icons/fa';

import './MainToolbar.scss';

const MainToolbar = props => {
  const { onSubmitChanges, onShowWorkflow } = props;
  return (
    <div className="MainToolbar">
      <IconContext.Provider value={{ className: 'MainToolbar__buttonIcon' }}>
        <div className="MainToolbar__flexContainer">
          <div className="MainToolbar__section" />
          <div className="MainToolbar__section">
            <button
              className="MainToolbar__submitButton"
              type="button"
              onClick={onSubmitChanges}
            >
              <IconContext.Provider
                value={{
                  className: 'MainToolbar__submitButton__icon',
                }}
              >
                <FaSync />
              </IconContext.Provider>
            </button>
          </div>
          <div className="MainToolbar__section right">
            <button
              className="MainToolbar__iconButton"
              type="button"
              onClick={onShowWorkflow}
            >
              <FaScrewdriver />
            </button>
          </div>
        </div>
      </IconContext.Provider>
    </div>
  );
};

MainToolbar.propTypes = {
  onSubmitChanges: PropTypes.func.isRequired,
  onShowWorkflow: PropTypes.func.isRequired,
};

export default MainToolbar;
