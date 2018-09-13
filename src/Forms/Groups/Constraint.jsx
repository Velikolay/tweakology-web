import React from 'react';
import { Field } from 'formik';
import ConstraintItemSelector from './Inputs/ConstraintItemSelector';
import { nameWithPrefix, formikValueWithPrefix } from './Utils';
import { constraintAttributes } from '../../Static/Constraints';
import { withFormikContext } from '../FormikContext';

import './Groups.css';

const getAttributeGroup = (attribute) => {
  for (const group of constraintAttributes) {
    for (const variant of group.variants) {
      for (const option of variant.options) {
        if (attribute.value === option.value) {
          return group;
        }
      }
    }
  }
  return null;
};

const getAttributes1 = (itemOptions) => {
  if (itemOptions.length === 1) {
    // Size group
    return [constraintAttributes[constraintAttributes.length - 1]];
  }
  return constraintAttributes;
};

const getAttributes2 = (attribute1) => {
  const group = getAttributeGroup(attribute1);
  if (group && group.label !== 'Size') {
    return [group];
  }
  return [];
};

const getItems2 = (itemOptions, item1) => itemOptions.filter(item => item.value !== item1.value);

const Constraint = (props) => {
  const {
    formik,
    itemOptions,
  } = props;

  const {
    values,
    formData,
    errors,
    touched,
    setFieldValue,
    handleChange,
  } = formik;

  const attribute1 = formikValueWithPrefix(props, 'first.attribute');
  const attribute2 = formikValueWithPrefix(props, 'second.attribute');
  const item1 = formikValueWithPrefix(props, 'first.item');

  if (attribute2 && attribute2.value) {
    const group1 = getAttributeGroup(attribute1);
    const group2 = getAttributeGroup(attribute2);
    if (group1 && group2 && group1.label !== group2.label) {
      // reset second attribute if the group is invalid
      setFieldValue(nameWithPrefix(props, 'second.attribute.value'), '');
    }
  }

  const attributes1 = getAttributes1(itemOptions);
  const attributes2 = getAttributes2(attribute1);
  const items2 = getItems2(itemOptions, item1);
  const disabled = !values.meta.added;

  const priorityDisabled = formData.constraint.meta.synced && values.priority === 1000;
  const priorityMax = formData.constraint.meta.synced && values.priority < 1000 ? 999 : 1000;

  return (
    <div className="form-group">
      <div className="form-row">
        <ConstraintItemSelector prefix={nameWithPrefix(props, 'first')} items={itemOptions} attributes={attributes1} disabled={disabled} />
      </div>
      <div className="form-row">
        <select
          id={nameWithPrefix(props, 'relation')}
          value={formikValueWithPrefix(props, 'relation')}
          onChange={handleChange}
          disabled={disabled}
        >
          <option value="-1">Less Than or Equal</option>
          <option value="0">Equal</option>
          <option value="1">Greater Than or Equal</option>
        </select>
      </div>
      {
        items2.length > 0 && attributes2.length > 0
          ? (
            <div className="form-row">
              <ConstraintItemSelector prefix={nameWithPrefix(props, 'second')} items={items2} attributes={attributes2} disabled={disabled} />
            </div>
          )
          : null
      }
      <div className="form-row">
        <label className="input-title">
          Multiplier
        </label>
        <Field name={nameWithPrefix(props, 'multiplier')} type="number" min={0} step={0.1} disabled={disabled} className={errors.multiplier && touched.multiplier ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <div className="form-row">
        <label className="input-title">
          Constant
        </label>
        <Field name={nameWithPrefix(props, 'constant')} type="number" className={errors.constant && touched.constant ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <div className="form-row">
        <label className="input-title">
          Priority
        </label>
        <Field name={nameWithPrefix(props, 'priority')} type="number" min={0} max={priorityMax} disabled={priorityDisabled} className={errors.priority && touched.priority ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <div className="form-row">
        <label className="input-title">
          Installed
        </label>
        <Field name={nameWithPrefix(props, 'isActive')} type="checkbox" checked={formikValueWithPrefix(props, 'isActive')} className={errors.isActive && touched.isActive ? 'full-width-input error' : 'full-width-input'} />
      </div>
    </div>
  );
};

export default withFormikContext(Constraint);
