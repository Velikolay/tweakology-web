import React from 'react';

import { AttributeFormikShape } from '../Shapes';
import { withFormikContext } from '../../../contexts/FormikContext';
import DeviceContext from '../../../contexts/DeviceContext';

import Field from '../Inputs/Field';
import { toFontStyles } from '../../../utils/font';
import {
  nameWithPrefix,
  titleForField,
  formikValueWithPrefix,
} from '../FormikHelpers';

import './Blocks.scss';

const Font = props => {
  const {
    formik: { touched, errors },
  } = props;

  const familyNameId = nameWithPrefix(props, 'familyName');
  const fontNameId = nameWithPrefix(props, 'fontName');
  const pointSizeId = nameWithPrefix(props, 'pointSize');
  return (
    <DeviceContext.Consumer>
      {device => (
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
              {device.fonts.families.map(familyName => (
                <option key={familyName}>{familyName}</option>
              ))}
            </Field>
          </div>
          <div className="form-row">
            <label className="input-title" htmlFor={fontNameId}>
              {titleForField(props, 'style', 'Font Style')}
            </label>
            <Field
              component="select"
              name={fontNameId}
              className="full-width-input"
            >
              {device.fonts.all[formikValueWithPrefix(props, 'familyName')].map(
                fontName => (
                  <option key={fontName} value={fontName}>
                    {toFontStyles(fontName)}
                  </option>
                ),
              )}
            </Field>
          </div>
          <div className="form-row">
            <label className="input-title" htmlFor={pointSizeId}>
              {titleForField(props, 'size', 'Size')}
            </label>
            <Field
              name={pointSizeId}
              type="number"
              min={0}
              className={
                errors.pointSize && touched.pointSize
                  ? 'full-width-input error'
                  : 'full-width-input'
              }
            />
          </div>
        </div>
      )}
    </DeviceContext.Consumer>
  );
};

Font.propTypes = {
  formik: AttributeFormikShape.isRequired,
};

export default withFormikContext(Font);
