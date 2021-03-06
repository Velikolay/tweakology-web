import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaPlus, FaSearch } from 'react-icons/fa';

import './Toolbar.scss';

const Toolbar = props => {
  const { eventHandler } = props;
  return (
    <div className="TreeToolbar">
      <IconContext.Provider value={{ className: 'TreeToolbar__buttonIcon' }}>
        <button
          className="TreeToolbar__button"
          type="button"
          onClick={() => eventHandler('enhancementclick')}
        >
          <FaPlus />
        </button>
        <button
          className="TreeToolbar__button"
          type="button"
          onClick={() => eventHandler('enhancementclick')}
        >
          <FaSearch />
        </button>
      </IconContext.Provider>
    </div>
  );
};

Toolbar.propTypes = {
  eventHandler: PropTypes.func.isRequired,
};

export default Toolbar;
