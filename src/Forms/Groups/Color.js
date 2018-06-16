import React from 'react';

import './Groups.css';
import './Color.css';

const ColorGroup = props => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          Alpha
        </label>
        <input
          id="alpha"
          placeholder=""
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={values.alpha}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.alpha && touched.alpha ? 'full-width-input error' : 'full-width-input'}
        />
      </div>
      <div className="form-row">
        <label className="input-title">
          Background
        </label>
        <input
          id="colorHex"
          placeholder=""
          type="text"
          value={values.colorHex}
          onChange={handleChange}
          onBlur={handleBlur}
          className="color-input"
        />
        <input
          type="color"
          value={values.colorHex}
          className="color-picker-input"
          onChange={event => props.setFieldValue("colorHex", event.target.value)}
        />
      </div>
    </div>
  );
}

export default ColorGroup;