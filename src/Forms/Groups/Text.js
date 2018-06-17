import React from 'react';
import { Field } from 'formik';

import './Groups.css';
import { nameWithPrefix, titleForField } from './Utils';

const TextGroup = props => {
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, "text", "Text")}
        </label>
        <Field name={nameWithPrefix(props, "text")} type="text" className="full-width-input" />
      </div>
    </div>
  );
}

export default TextGroup;