// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import cx from 'classnames';

import './Select.scss';

type SelectProps = {
  className?: string,
  name: string,
};

const Select = (props: SelectProps) => {
  const { name, className, ...rest } = props;
  return (
    <Field
      className={cx('Select', className)}
      component="select"
      name={name}
      {...rest}
    />
  );
};

Select.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Select.defaultProps = {
  className: '',
};

export default Select;
