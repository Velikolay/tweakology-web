// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactToggle from 'react-toggle';

import 'react-toggle/style.css';
import './Toggle.scss';

type ToggleProps = {
  name: string,
  title?: string,
  defaultChecked?: boolean,
  className?: string,
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
};

const Toggle = (props: ToggleProps) => {
  const {
    name,
    title,
    className,
    defaultChecked,
    formik: { setFieldValue, values },
    ...rest
  } = props;
  return (
    <div className={cx('Toggle', className)}>
      <ReactToggle
        defaultChecked={defaultChecked}
        checked={values[name]}
        onChange={e => setFieldValue(name, e.target.checked)}
        {...rest}
      />
      {title !== null ? <div className="Toggle__title">{title}</div> : null}
    </div>
  );
};

Toggle.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  defaultChecked: PropTypes.bool,
};

Toggle.defaultProps = {
  title: null,
  className: '',
  defaultChecked: false,
};

export default Toggle;
