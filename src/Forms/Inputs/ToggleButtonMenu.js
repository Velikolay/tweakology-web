import React from 'react';
import cx from 'classnames';

import './ToggleButtonMenu.css';

const ToggleButtonMenu = (props) => {
  if (props.options.length) {
    const width = 100/props.options.length;
    const buttons = props.options.map(option => {
      return <ToggleButton width={`${width}%`} {...option} />
    });
    return (
      <div className="toggle-buttons-menu">
        {buttons}
      </div>
    );
  }
};

const ToggleButton = (props) => {
  const toggle = (e) => {
    console.log(e);
  }

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
      onClick={toggle}>
      {props.text}
    </button>
  );
};

const onChange = (e) => {
  console.log(e.target.value);
}

export default ToggleButtonMenu;