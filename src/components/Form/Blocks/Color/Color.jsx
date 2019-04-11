import React from 'react';

import { AttributeFormikShape } from '../../Shapes';
import { withFormikContext } from '../../../../contexts/FormikContext';

import Field from '../../Inputs/Field';
import {
  nameWithPrefix,
  titleForField,
  formikValueWithPrefix,
} from '../../FormikHelpers';

import '../Blocks.scss';
import './Color.scss';

const Color = props => {
  const {
    formik: { setFieldValue },
  } = props;
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
          value={formikValueWithPrefix(props, 'hexValue')}
          className="Color__pickerInput"
          onChange={event => setFieldValue(color, event.target.value)}
        />
      </div>
    </div>
  );
};

Color.propTypes = {
  formik: AttributeFormikShape.isRequired,
};

export default withFormikContext(Color);
