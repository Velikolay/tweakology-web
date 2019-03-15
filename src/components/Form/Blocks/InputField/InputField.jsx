import React from 'react';
import PropTypes from 'prop-types';

import { withFormikContext } from '../../../../contexts/Form/FormikContext';

import Field from '../../Inputs/Field/Field';

import '../Blocks.css';

const InputField = ({ title, ...rest }) => (
  <div className="form-group">
    <div className="form-row">
      <label className="input-title">{title}</label>
      <Field {...rest} className="full-width-input" />
    </div>
  </div>
);

InputField.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withFormikContext(InputField);
