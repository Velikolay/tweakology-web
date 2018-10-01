import React from 'react';
import PropTypes from 'prop-types';
import Field from './Inputs/Field';
import { withFormikContext } from '../FormikContext';
import SystemContext from '../../System/SystemContext';
import { nameWithPrefix, titleForField, formikValueWithPrefix } from './Utils';

import './Groups.css';

const FontGroup = (props) => {
  const {
    formik: { touched, errors, handleChange },
  } = props;

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
            <Field
              component="select"
              name={familyNameId}
              className="full-width-input"
            >
              {
                systemContext.fonts.families.map(familyName => (
                  <option key={familyName}>
                    {familyName}
                  </option>
                ))
              }
            </Field>
          </div>
          <div className="form-row">
            <label className="input-title" htmlFor={fontStyleId}>
              {titleForField(props, 'style', 'Font Style')}
            </label>
            <Field
              component="select"
              name={fontStyleId}
              className="full-width-input"
            >
              {
                systemContext.fonts.styles[formikValueWithPrefix(props, 'familyName')].map(fontStyle => (
                  <option key={fontStyle}>
                    {fontStyle}
                  </option>
                ))
              }
            </Field>
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
  formik: PropTypes.object.isRequired,
};

export default withFormikContext(FontGroup);
