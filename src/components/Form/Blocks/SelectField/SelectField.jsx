import React from 'react';
import PropTypes from 'prop-types';

import { withFormikContext } from '../../../../contexts/Form/FormikContext';

import Field from '../../Inputs/Field/Field';

import '../Blocks.css';

const SelectField = ({ name, options, title }) => (
  <div className="form-group">
    <div className="form-row">
      <label className="input-title">{title}</label>
      <Field name={name} component="select" className="full-width-input">
        {options.map(({ value, text }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default withFormikContext(SelectField);
