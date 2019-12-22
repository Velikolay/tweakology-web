// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './TextArea.scss';

type TextAreaProps = {
  className?: string,
  placeholder?: string,
  rows?: number,
};

type TextAreaControlledProps = TextAreaProps & {
  name: string,
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
};

type TextAreaUncontrolledProps = TextAreaProps & {
  defaultValue: string,
};

const TextAreaControlled = (props: TextAreaControlledProps) => {
  const {
    name,
    className,
    placeholder,
    rows,
    formik: { setFieldValue, values },
  } = props;
  return (
    <textarea
      className={cx('TextArea', className)}
      value={values[name]}
      placeholder={placeholder}
      rows={rows}
      onChange={e => setFieldValue(name, e.target.value)}
    />
  );
};

export const TextAreaUncontrolled = (props: TextAreaUncontrolledProps) => {
  const { className, defaultValue, placeholder, rows } = props;
  return (
    <textarea
      className={cx('TextArea', className)}
      defaultValue={defaultValue}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

const commonPropTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
};

const commonDefaultProps = {
  className: '',
  placeholder: '',
  rows: 4,
};

TextAreaUncontrolled.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  ...commonPropTypes,
};

TextAreaUncontrolled.defaultProps = commonDefaultProps;

TextAreaControlled.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.objectOf(PropTypes.any).isRequired,
  ...commonPropTypes,
};

TextAreaControlled.defaultProps = commonDefaultProps;

export default TextAreaControlled;
