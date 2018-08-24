import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { nameWithPrefix, valueWithPrefix, titleForField } from './Utils';

import './Groups.css';

const FontGroup = (props) => {
  const {
    systemMetadata,
    touched,
    errors,
    handleChange,
  } = props;

  const familyNameId = nameWithPrefix(props, 'familyName');
  const fontStyleId = nameWithPrefix(props, 'fontStyle');
  const pointSizeId = nameWithPrefix(props, 'pointSize');
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title" htmlFor={familyNameId}>
          {titleForField(props, 'family', 'Font Family')}
        </label>
        <select
          id={familyNameId}
          className="full-width-input"
          onChange={handleChange}
        >
          {
            systemMetadata.fonts.families.map(familyName => (familyName === valueWithPrefix(props, 'familyName') ? (
              <option selected>
                {' '}
                {familyName}
                {' '}
              </option>
            ) : (
              <option>
                {' '}
                {familyName}
                {' '}
              </option>
            )))
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={fontStyleId}>
          {titleForField(props, 'style', 'Font Style')}
        </label>
        <select
          id={fontStyleId}
          className="full-width-input"
          onChange={handleChange}
        >
          {
            systemMetadata.fonts.styles[valueWithPrefix(props, 'familyName')].map(fontStyle => (fontStyle === valueWithPrefix(props, 'fontStyle') ? (
              <option selected>
                {' '}
                {fontStyle}
                {' '}
              </option>
            ) : (
              <option>
                {' '}
                {fontStyle}
                {' '}
              </option>
            )))
          }
        </select>
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={pointSizeId}>
          {titleForField(props, 'size', 'Size')}
        </label>
        <Field name={pointSizeId} type="number" min={0} className={errors.pointSize && touched.pointSize ? 'full-width-input error' : 'full-width-input'} />
      </div>
    </div>
  );
};

FontGroup.propTypes = {
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  systemMetadata: PropTypes.object.isRequired,
};

export default FontGroup;
