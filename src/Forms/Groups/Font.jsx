import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { withFormikContext } from '../FormikContext';
import SystemContext from '../../System/SystemContext';
import { nameWithPrefix, titleForField, formikValueWithPrefix } from './Utils';

import './Groups.css';

const FontGroup = (props) => {
  const {
    touched,
    errors,
    handleChange,
  } = props.formik;

  const familyNameId = nameWithPrefix(props, 'familyName');
  const fontStyleId = nameWithPrefix(props, 'fontStyle');
  const pointSizeId = nameWithPrefix(props, 'pointSize');
  return (
    <SystemContext.Consumer>
      { systemContext => (
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
                systemContext.fonts.families.map(familyName => (familyName === formikValueWithPrefix(props, 'familyName') ? (
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
                systemContext.fonts.styles[formikValueWithPrefix(props, 'familyName')].map(fontStyle => (fontStyle === formikValueWithPrefix(props, 'fontStyle') ? (
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
      )}
    </SystemContext.Consumer>
  );
};

FontGroup.propTypes = {
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
};

export default withFormikContext(FontGroup);
