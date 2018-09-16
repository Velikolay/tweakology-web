import React from 'react';
import { Field } from 'formik';
import { withFormikContext } from '../FormikContext';

import './Groups.css';
import { nameWithPrefix, titleForField } from './Utils';

// Our inner form component. Will be wrapped with Formik({..})
const FrameGroup = (props) => {
  const {
    touched,
    errors,
  } = props.formik;
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, 'frame', 'Frame')}
        </label>
        <div className="half-width-input-container">
          <Field name={nameWithPrefix(props, 'x')} type="number" className="half-width-input" />
          {errors.x
          && touched.x && <div className="input-feedback">{errors.x}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            X
          </label>
        </div>
        <div className="half-width-input-container">
          <Field name={nameWithPrefix(props, 'y')} type="number" className="half-width-input" />
          {errors.y
          && touched.y && <div className="input-feedback">{errors.y}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            Y
          </label>
        </div>
      </div>
      <div className="form-row">
        <label className="input-title" />
        <div className="half-width-input-container">
          <Field name={nameWithPrefix(props, 'width')} type="number" className="half-width-input" />
          {errors.width
          && touched.width && <div className="input-feedback">{errors.width}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            Width
          </label>
        </div>
        <div className="half-width-input-container">
          <Field name={nameWithPrefix(props, 'height')} type="number" className="half-width-input" />
          {errors.height
          && touched.height && <div className="input-feedback">{errors.height}</div>}
          <label className="input-name" htmlFor="coord" style={{ display: 'block' }}>
            Height
          </label>
        </div>
      </div>
    </div>
  );
};

export default withFormikContext(FrameGroup);