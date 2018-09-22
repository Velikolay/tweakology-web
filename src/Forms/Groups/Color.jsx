import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { withFormikContext } from '../FormikContext';
import { nameWithPrefix, titleForField, formikValueWithPrefix } from './Utils';

import './Groups.css';
import './Color.css';

const ColorGroup = (props) => {
  const { formik: { setFieldValue } } = props;
  const alpha = nameWithPrefix(props, 'alpha');
  const color = nameWithPrefix(props, 'hexValue');
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title" htmlFor={alpha}>
          {titleForField(props, 'alpha', 'Alpha')}
        </label>
        <Field name={alpha} type="number" min={0} max={1} step={0.05} className="full-width-input" />
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={color}>
          {titleForField(props, 'color', 'Color')}
        </label>
        <Field name={color} type="text" className="color-input" />
        <input
          type="color"
          value={formikValueWithPrefix(props, 'hexValue')}
          className="color-picker-input"
          onChange={event => setFieldValue(color, event.target.value)}
        />
      </div>
    </div>
  );
};

ColorGroup.propTypes = {
  formik: PropTypes.object.isRequired,
};

export default withFormikContext(ColorGroup);
