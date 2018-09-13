import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withFormikContext } from '../../FormikContext';
import { formikValueWithPrefix } from '../Utils';

import './ToggleButtonMenu.css';

const ToggleButtonMenu = (props) => {
  const {
    options,
    disabled,
    onSwitch,
  } = props;
  if (options.length) {
    const width = 100 / options.length;
    const buttons = options.map((option) => {
      const optionValue = formikValueWithPrefix(props, option.name);
      return (
        <ToggleButton
          width={`${width}%`}
          isOn={optionValue}
          disabled={disabled}
          {...option}
          onSwitch={() => onSwitch(option.name, !optionValue)}
        />
      );
    });
    return (
      <div className="toggle-buttons-menu">
        {buttons}
      </div>
    );
  }
  return null;
};

ToggleButtonMenu.propTypes = {
  options: PropTypes.array.isRequired,
  disabled: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired,
};

const ToggleButton = (props) => {
  const {
    image,
    text,
    width,
    disabled,
    isOn,
    onSwitch,
  } = props;

  const style = { width };
  if (image) {
    style.background = `url(${image})`;
  }

  return (
    <button
      style={style}
      className={cx('toggle-button', {
        'is-active': isOn,
      })}
      type="button"
      disabled={disabled}
      onClick={onSwitch}
    >
      {text}
    </button>
  );
};

ToggleButton.propTypes = {
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  isOn: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired,
};

export default withFormikContext(ToggleButtonMenu);
