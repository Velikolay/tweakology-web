// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './TextArea.scss';

type TextAreaProps = {
  name: string,
  className?: string,
  placeholder?: string,
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
};

const TextArea = (props: TextAreaProps) => {
  const {
    name,
    className,
    placeholder,
    formik: { setFieldValue, values },
    ...rest
  } = props;
  return (
    <textarea
      className={cx('TextArea', className)}
      placeholder={placeholder}
      onChange={e => setFieldValue(name, e.target.value)}
      {...rest}
    >
      {values[name]}
    </textarea>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

TextArea.defaultProps = {
  className: '',
  placeholder: '',
};

export default TextArea;
