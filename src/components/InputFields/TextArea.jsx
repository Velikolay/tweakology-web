// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './TextArea.scss';

type TextAreaControlledProps = {
  name: string,
  className?: string,
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
};

type TextAreaUncontrolledProps = {
  className?: string,
  defaultValue: string,
};

const TextAreaControlled = (props: TextAreaControlledProps) => {
  const {
    name,
    className,
    formik: { setFieldValue, values },
    ...rest
  } = props;
  return (
    <textarea
      className={cx('TextArea', className)}
      value={values[name]}
      onChange={e => setFieldValue(name, e.target.value)}
      {...rest}
    />
  );
};

export const TextAreaUncontrolled = (props: TextAreaUncontrolledProps) => {
  const { className, defaultValue, ...rest } = props;
  return (
    <textarea
      className={cx('TextArea', className)}
      defaultValue={defaultValue}
      {...rest}
    />
  );
};

TextAreaUncontrolled.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  className: PropTypes.string,
};

TextAreaUncontrolled.defaultProps = {
  className: '',
};

TextAreaControlled.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

TextAreaControlled.defaultProps = {
  className: '',
};

export default TextAreaControlled;
