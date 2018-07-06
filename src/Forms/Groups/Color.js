import React from 'react';
import { Field } from 'formik';

import './Groups.css';
import './Color.css';

import { nameWithPrefix, valueWithPrefix, titleForField } from './Utils';

const ColorGroup = props => {
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, "alpha", "Alpha")}
        </label>
        <Field name={nameWithPrefix(props, "alpha")} type="number" min={0} max={1} step={0.05} className="full-width-input" />
      </div>
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, "color", "Color")}
        </label>
        <Field name={nameWithPrefix(props, "hexValue")} type="text" className="color-input" />
        <input
          type="color"
          value={valueWithPrefix(props, "hexValue")}
          className="color-picker-input"
          onChange={event => props.setFieldValue(nameWithPrefix(props, "hexValue"), event.target.value)}
        />
      </div>
    </div>
  );
}

export default ColorGroup;