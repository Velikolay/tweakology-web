import React, { useContext } from 'react';

import FormikContext from '../../FormikContext';

import Field from '../../Inputs/Field';
import {
  nameWithPrefix,
  titleForField,
  formikValueWithPrefix,
} from '../../../../form/FormikHelpers';

import '../Blocks.scss';
import './Color.scss';

const Color = props => {
  const formik = useContext(FormikContext);
  const { setFieldValue } = formik;
  const alpha = nameWithPrefix(props, 'alpha');
  const color = nameWithPrefix(props, 'hexValue');
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title" htmlFor={alpha}>
          {titleForField(props, 'alpha', 'Alpha')}
        </label>
        <Field
          name={alpha}
          type="number"
          min={0}
          max={1}
          step={0.05}
          className="full-width-input"
        />
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={color}>
          {titleForField(props, 'color', 'Color')}
        </label>
        <Field name={color} type="text" className="Color__textInput" />
        <input
          type="color"
          value={formikValueWithPrefix(formik, props, 'hexValue')}
          className="Color__pickerInput"
          onChange={event => setFieldValue(color, event.target.value)}
        />
      </div>
    </div>
  );
};

export default Color;
