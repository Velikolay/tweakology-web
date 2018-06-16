import React from 'react';

import './Groups.css';

const FontGroup = props => {
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
          Font Family
        </label>
        <select
          id="fontFamily"
          className="full-width-input"
          onChange={handleChange}
        >
          {
            props.systemMetadata.fonts.families.map(fontFamily => fontFamily === values.fontFamily ? <option selected> {fontFamily} </option> : <option> {fontFamily} </option>)
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title">
          Font Style
        </label>
        <select
          id="fontStyle"
          className="full-width-input"
          onChange={handleChange}
        >
          {
            props.systemMetadata.fonts.styles[values.fontFamily].map(fontStyle => fontStyle === values.fontStyle ? <option selected> {fontStyle} </option> : <option> {fontStyle} </option>)
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title">
          Size
        </label>
        <input
          id="pointSize"
          placeholder=""
          type="number"
          min={0}
          value={values.pointSize}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.pointSize && touched.pointSize ? 'full-width-input error' : 'full-width-input'}
        />
      </div>
    </div>
  );
}

export default FontGroup;