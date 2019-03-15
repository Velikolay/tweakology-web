import React from 'react';
import PropTypes from 'prop-types';

import { withFormikContext } from '../../../../contexts/Form/FormikContext';

import Field from '../../Inputs/Field/Field';
import ConstraintItemSelector from '../../Inputs/ConstraintItemSelector/ConstraintItemSelector';
import { nameWithPrefix, formikValueWithPrefix } from '../../FormikHelpers';
import { constraintAttributes } from '../../../../Static/Constraints';

import '../Blocks.css';

const getAttributeGroup = attribute => {
  for (const group of constraintAttributes) {
    for (const variant of group.variants) {
      for (const option of variant.options) {
        if (attribute === option.value) {
          return group;
        }
      }
    }
  }
  return null;
};

const getAttributes1 = itemOptions => {
  if (itemOptions.length === 1) {
    // Size group
    return [constraintAttributes[constraintAttributes.length - 1]];
  }
  return constraintAttributes;
};

const getAttributes2 = attribute1 => {
  const group = getAttributeGroup(attribute1.value);
  if (group && group.label !== 'Size') {
    return [group];
  }
  return [];
};

const getItems2 = (itemOptions, item1) =>
  itemOptions.filter(item => item.value !== item1.value);

const Constraint = props => {
  const {
    formik: { values, formData, errors, touched, setFieldValue },
    itemOptions,
  } = props;

  const onAttribute1Change = attribute1 => {
    const attribute2 = formikValueWithPrefix(props, 'second.attribute.value');
    if (attribute2) {
      const group1 = getAttributeGroup(attribute1);
      const group2 = getAttributeGroup(attribute2);
      if (group1 && group2 && group1.label !== group2.label) {
        // reset second attribute if the first and second attribute groups don't match
        setFieldValue(nameWithPrefix(props, 'second.attribute.value'), '');
      }
    }
  };

  const attribute1 = formikValueWithPrefix(props, 'first.attribute');
  const item1 = formikValueWithPrefix(props, 'first.item');

  const attributes1 = getAttributes1(itemOptions);
  const attributes2 = getAttributes2(attribute1);
  const items2 = getItems2(itemOptions, item1);
  const disabled = !values.meta.added;

  const priorityDisabled =
    formData.constraint.meta.synced && values.priority === 1000;
  const priorityMax =
    formData.constraint.meta.synced && values.priority < 1000 ? 999 : 1000;

  const multiplier = nameWithPrefix(props, 'multiplier');
  const constant = nameWithPrefix(props, 'constant');
  const priority = nameWithPrefix(props, 'priority');
  const isActive = nameWithPrefix(props, 'isActive');

  return (
    <div className="form-group">
      <div className="form-row">
        <ConstraintItemSelector
          prefix={nameWithPrefix(props, 'first')}
          disabled={disabled}
          items={itemOptions}
          attributes={attributes1}
          onAttributeChange={onAttribute1Change}
        />
      </div>
      <div className="form-row">
        <Field
          component="select"
          name={nameWithPrefix(props, 'relation')}
          disabled={disabled}
        >
          <option value="-1">Less Than or Equal</option>
          <option value="0">Equal</option>
          <option value="1">Greater Than or Equal</option>
        </Field>
      </div>
      {items2.length > 0 && attributes2.length > 0 ? (
        <div className="form-row">
          <ConstraintItemSelector
            prefix={nameWithPrefix(props, 'second')}
            disabled={disabled}
            items={items2}
            attributes={attributes2}
          />
        </div>
      ) : null}
      <div className="form-row">
        <label className="input-title" htmlFor={multiplier}>
          Multiplier
        </label>
        <Field
          name={multiplier}
          type="number"
          min={0}
          step={0.1}
          disabled={disabled}
          className={
            errors.multiplier && touched.multiplier
              ? 'full-width-input error'
              : 'full-width-input'
          }
        />
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={constant}>
          Constant
        </label>
        <Field
          name={constant}
          type="number"
          className={
            errors.constant && touched.constant
              ? 'full-width-input error'
              : 'full-width-input'
          }
        />
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={priority}>
          Priority
        </label>
        <Field
          name={priority}
          type="number"
          min={0}
          max={priorityMax}
          disabled={priorityDisabled}
          className={
            errors.priority && touched.priority
              ? 'full-width-input error'
              : 'full-width-input'
          }
        />
      </div>
      <div className="form-row">
        <label className="input-title" htmlFor={isActive}>
          Installed
        </label>
        <Field
          name={isActive}
          type="checkbox"
          checked={formikValueWithPrefix(props, 'isActive')}
          className={
            errors.isActive && touched.isActive
              ? 'full-width-input error'
              : 'full-width-input'
          }
        />
      </div>
    </div>
  );
};

Constraint.propTypes = {
  formik: PropTypes.object.isRequired,
  itemOptions: PropTypes.array.isRequired,
};

export default withFormikContext(Constraint);
