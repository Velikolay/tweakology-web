import React, { useContext } from 'react';

import FormikContext from '../FormikContext';

import Field from '../Inputs/Field';
import { nameWithPrefix, titleForField } from '../../../form/FormikHelpers';

import './Blocks.scss';

const Frame = props => {
  const { touched, errors } = useContext(FormikContext);
  const x = nameWithPrefix(props, 'x');
  const y = nameWithPrefix(props, 'y');
  const width = nameWithPrefix(props, 'width');
  const height = nameWithPrefix(props, 'height');
  return (
    <div className="form-group">
      <div className="form-row">
        <div className="input-title">
          {titleForField(props, 'frame', 'Frame')}
        </div>
        <div className="half-width-input-container">
          <Field id={x} name={x} type="number" className="half-width-input" />
          {errors.x && touched.x && (
            <div className="input-feedback">{errors.x}</div>
          )}
          <label
            className="input-name"
            htmlFor={x}
            style={{ display: 'block' }}
          >
            X
          </label>
        </div>
        <div className="half-width-input-container">
          <Field id={y} name={y} type="number" className="half-width-input" />
          {errors.y && touched.y && (
            <div className="input-feedback">{errors.y}</div>
          )}
          <label
            className="input-name"
            htmlFor={y}
            style={{ display: 'block' }}
          >
            Y
          </label>
        </div>
      </div>
      <div className="form-row">
        <div className="input-title" />
        <div className="half-width-input-container">
          <Field
            id={width}
            name={width}
            type="number"
            className="half-width-input"
          />
          {errors.width && touched.width && (
            <div className="input-feedback">{errors.width}</div>
          )}
          <label
            id="frameWidth"
            className="input-name"
            htmlFor={width}
            style={{ display: 'block' }}
          >
            Width
          </label>
        </div>
        <div className="half-width-input-container">
          <Field
            id={height}
            name={height}
            type="number"
            className="half-width-input"
          />
          {errors.height && touched.height && (
            <div className="input-feedback">{errors.height}</div>
          )}
          <label
            className="input-name"
            htmlFor={height}
            style={{ display: 'block' }}
          >
            Height
          </label>
        </div>
      </div>
    </div>
  );
};

export default Frame;
