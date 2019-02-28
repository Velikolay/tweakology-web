import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import './OffsetSlider.css';

const HANDLE_STYLE = {
  borderColor: '#c89637',
  borderWidth: 2,
  height: 14,
  width: 14,
  marginTop: -5,
  backgroundColor: '#e0e0e0',
};

const TRACK_STYLE = {
  backgroundColor: '#c89637',
  height: 5,
};

const RAIL_STYLE = {
  backgroundColor: '#e0e0e0',
  height: 5,
};

const OffsetSlider = ({ initial, min, max, onChange }) => (
  <Slider
    className="offset-slider"
    min={min}
    max={max}
    defaultValue={initial}
    trackStyle={TRACK_STYLE}
    handleStyle={HANDLE_STYLE}
    railStyle={RAIL_STYLE}
    onChange={onChange}
  />
);

OffsetSlider.propTypes = {
  initial: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

OffsetSlider.defaultProps = {
  initial: 2,
  min: 1,
  max: 25,
};

export default OffsetSlider;
