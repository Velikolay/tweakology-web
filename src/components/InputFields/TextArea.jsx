// @flow
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Prism from 'prismjs';
import './LiquidCodeHighlight';

import { deepValue } from '../Formik';

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

const stripHtml = html => {
  return html.textContent || html.innerText || '';
};

export const LiquidCodeBlockControlled = (props: TextAreaControlledProps) => {
  const {
    name,
    formik: { setFieldValue, values },
  } = props;

  const codeRef = useRef();
  useEffect(() => {
    if (codeRef && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  });

  return (
    <pre>
      <code
        ref={codeRef}
        className="language-liquid"
        contentEditable
        onInput={e => setFieldValue(name, stripHtml(e.target))}
      >
        {deepValue(values, name)}
      </code>
    </pre>
  );
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
      value={deepValue(values, name)}
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
