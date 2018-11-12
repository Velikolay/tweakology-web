import React from 'react';
import Field from './Inputs/Field';
import { withFormikContext } from '../FormikContext';

import './Groups.css';

const InputField = ({ title, ...rest }) => (
  <div className="form-group">
    <div className="form-row">
      <label className="input-title">{title}</label>
      <Field {...rest} className="full-width-input" />
    </div>
  </div>
);

export default withFormikContext(InputField);
