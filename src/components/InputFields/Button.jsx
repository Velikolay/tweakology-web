// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Button.scss';

type ButtonProps = {
  className?: string,
  submit?: boolean,
  onClick?: () => void,
  children?: React.Node,
};

const Button = (props: ButtonProps) => {
  const { submit, className, onClick, children } = props;
  return (
    /* eslint-disable react/button-has-type */
    <button
      className={cx('Button', className)}
      type={submit ? 'submit' : 'button'}
      onClick={onClick}
    >
      {children}
    </button>
    /* eslint-enable react/button-has-type */
  );
};

Button.propTypes = {
  submit: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

Button.defaultProps = {
  submit: true,
  className: '',
  onClick: () => {},
  children: '',
};

export default Button;
