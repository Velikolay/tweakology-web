import React from 'react';
import PropTypes from 'prop-types';

import { IconContext } from 'react-icons';
import { FaClone } from 'react-icons/fa';

import './TextureOnOffButton.css';

const TextureOnOffButton = ({ onClick }) => (
  <button className="texture-onoff-button" type="button" onClick={onClick}>
    <IconContext.Provider value={{ className: 'texture-onoff-icon' }}>
      <FaClone />
    </IconContext.Provider>
  </button>
);

TextureOnOffButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default TextureOnOffButton;
