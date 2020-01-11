// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactToggle from 'react-toggle';

import { deepValue } from '../Formik';

import 'react-toggle/style.css';
import './Toggle.scss';

type ToggleProps = {
  name: string,
  title?: string,
  className?: string,
  formik: {
    setFieldValue: (string, boolean) => void,
    values: any,
  },
};

const Toggle = (props: ToggleProps) => {
  const {
    name,
    title,
    className,
    formik: { setFieldValue, values },
  } = props;
  return (
    <div className={cx('Toggle', className)}>
      <ReactToggle
        checked={deepValue(values, name)}
        onChange={e => setFieldValue(name, e.target.checked)}
      />
      {title !== null ? <div className="Toggle__title">{title}</div> : null}
    </div>
  );
};

Toggle.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

Toggle.defaultProps = {
  title: null,
  className: '',
};

export default Toggle;
