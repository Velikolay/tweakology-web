import React from 'react';
import { Field } from 'formik';
import ConstraintItemSelector from '../Inputs/ConstraintItemSelector.js';

import './Groups.css';

import { nameWithPrefix, valueWithPrefix, titleForField } from './Utils';

const FontGroup = props => {
  const {
    touched,
    errors,
    handleChange,
  } = props;

  const item = {
    value: 'ZDNjNGRhNW',
    options: [
      { label: 'UIButton', value: 'MGQ3MDAyZD' },
      { label: 'UILabel', value: 'N2MyOTZhNT' },
      { label: 'superview', value: 'ZDNjNGRhNW' }
    ]
  };

  const attribute = {
    value: 'left',
    groups: [
      {
        label: 'Space',
        options: [
          { label: 'Top', value: 'top', hasOptions: true },
          { label: 'Bottom', value: 'bottom', hasOptions: true },
          { label: 'Left', value: 'left', hasOptions: true },
          { label: 'Right', value: 'right', hasOptions: true }
        ]
      },
      {
        label: 'Size',
        options: [
          { label: 'Width', value: 'width'},
          { label: 'Height', value: 'height'}
        ]
      },
    ]
  };

  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, "family", "Font Family")}
        </label>
        <select
          id={nameWithPrefix(props, "familyName")}
          className="full-width-input"
          onChange={handleChange}
        >
          {
            props.systemMetadata.fonts.families.map(familyName => familyName === valueWithPrefix(props, "familyName") ? <option selected> {familyName} </option> : <option> {familyName} </option>)
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, "style", "Font Style")}
        </label>
        <select
          id={nameWithPrefix(props, "fontStyle")}
          className="full-width-input"
          onChange={handleChange}
        >
          {
            props.systemMetadata.fonts.styles[valueWithPrefix(props, "familyName")].map(fontStyle => fontStyle === valueWithPrefix(props, "fontStyle") ? <option selected> {fontStyle} </option> : <option> {fontStyle} </option>)
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, "size", "Size")}
        </label>
        <Field name={nameWithPrefix(props, "pointSize")} type="number" min={0} className={errors.pointSize && touched.pointSize ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <ConstraintItemSelector item={item} attribute={attribute} />
    </div>
  );
}

export default FontGroup;