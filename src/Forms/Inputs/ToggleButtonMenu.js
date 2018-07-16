import React from 'react';
import cx from 'classnames';
import { nameWithPrefix, formikValueWithPrefix } from '../Groups/Utils';

import './ToggleButtonMenu.css';

const ToggleButtonMenu = (props) => {
  const {
    setFieldValue
  } = props.formik;
  if (props.options.length) {
    const width = 100 / props.options.length;
    const buttons = props.options.map(option => {
      const optionValue = formikValueWithPrefix(props, option.name);
      return <ToggleButton width={`${width}%`} isEnabled={optionValue} {...option} onClick={() => {
        setFieldValue(nameWithPrefix(props, option.name), !optionValue);
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
        'is-active': props.isEnabled
      })}
      type="button"
      onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default ToggleButtonMenu;