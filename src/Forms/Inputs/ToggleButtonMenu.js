import React from 'react';
import cx from 'classnames';
import { nameWithPrefix } from '../Groups/Utils';

import './ToggleButtonMenu.css';

const ToggleButtonMenu = (props) => {
  if (props.options.length) {
    const width = 100 / props.options.length;
    const buttons = props.options.map(option => {
      return <ToggleButton width={`${width}%`} {...option} onClick={() => {
        props.setFieldValue(nameWithPrefix(props, option.name), !option.isActive);
      }} />
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
        'is-active': props.isActive
      })}
      type="button"
      onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default ToggleButtonMenu;