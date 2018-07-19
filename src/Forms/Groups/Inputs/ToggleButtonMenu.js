import React from 'react';
import cx from 'classnames';
import { formikValueWithPrefix } from '../Utils';

import './ToggleButtonMenu.css';

const ToggleButtonMenu = (props) => {
  if (props.options.length) {
    const width = 100 / props.options.length;
    const buttons = props.options.map(option => {
      const optionValue = formikValueWithPrefix(props, option.name);
      return <ToggleButton 
                width={`${width}%`}
                isOn={optionValue}
                {...option}
                onSwitch={() => props.onSwitch(option.name, !option.value)} />
    });
    return (
      <div className="toggle-buttons-menu">
        {buttons}
      </div>
    );
  }
};

const ToggleButton = (props) => {
  let style = {
    width: props.width
  };
  if (props.image) {
    style.background = `url(${props.image})`;
  }

  return (
    <button
      style={style}
      className={cx('toggle-button', {
        'is-active': props.isOn
      })}
      type="button"
      onClick={props.onSwitch}>
      {props.text}
    </button>
  );
};

export default ToggleButtonMenu;