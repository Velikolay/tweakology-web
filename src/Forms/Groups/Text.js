import React from 'react';

import './Groups.css';

const TextGroup = props => {
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
          Text
        </label>
        <input
          id="text"
          placeholder=""
          type="text"
          value={values.text}
          onChange={handleChange}
          onBlur={handleBlur}
          className="full-width-input"
        />
      </div>
    </div>
  );
}

export default TextGroup;