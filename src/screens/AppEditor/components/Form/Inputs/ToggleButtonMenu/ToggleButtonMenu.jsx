import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import FormikContext from '../../FormikContext';
import { formikValueWithPrefix } from '../../../../form/FormikHelpers';

import './ToggleButtonMenu.scss';

const ToggleButtonMenu = props => {
  const {
    className,
    name: globalName,
    exclusiveMode,
    disabled,
    onSwitch,
    children,
  } = props;
  const formik = useContext(FormikContext);
  if (children.length) {
    const exclusiveValue = exclusiveMode
      ? formikValueWithPrefix(formik, props, globalName)
      : null;
    const width = 100 / children.length;
    const buttons = children.map(
      ({
        props: {
          name: optionName,
          value: optionValue,
          children: optionChildren,
        },
      }) => {
        const isOn = exclusiveMode
          ? exclusiveValue === optionValue
          : formikValueWithPrefix(formik, props, optionName);
        const name = exclusiveMode ? globalName : optionName;
        const value = exclusiveMode ? optionValue : !isOn;
        const key = exclusiveMode ? `${globalName}-${optionValue}` : optionName;
        return (
          <ToggleButton
            key={key}
            width={width}
            isOn={isOn}
            disabled={disabled}
            onSwitch={() => onSwitch(name, value)}
          >
            {optionChildren}
          </ToggleButton>
        );
      },
    );
    return <div className={className}>{buttons}</div>;
  }
  return null;
};

const ToggleButton = props => {
  const { width, disabled, isOn, children, onSwitch } = props;

  const style = { width: `${width}%` };

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
      {children}
    </button>
  );
};

ToggleButtonMenu.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  exclusiveMode: PropTypes.bool,
  onSwitch: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

ToggleButtonMenu.defaultProps = {
  className: '',
  name: '',
  exclusiveMode: false,
  disabled: false,
};

ToggleButton.propTypes = {
  disabled: PropTypes.bool,
  width: PropTypes.number.isRequired,
  isOn: PropTypes.bool.isRequired,
  onSwitch: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

ToggleButton.defaultProps = {
  disabled: false,
};

export default ToggleButtonMenu;
