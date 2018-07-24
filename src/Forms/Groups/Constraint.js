import React from 'react';
import ConstraintItemSelector from './Inputs/ConstraintItemSelector';
import { nameWithPrefix, formikValueWithPrefix } from './Utils';
import { constraintAttributes } from '../../Static/Constraints';
import { Field } from 'formik';

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
}

const getAttributes2 = (attribute1) => {
  const group = getAttributeGroup(attribute1);
  if (group && group.label !== 'Size') {
    return [group];
  } else {
    return [];
  }
}

const Constraint = props => {
  const {
    errors,
    touched,
    setFieldValue
  } = props.formik;

  const attribute1 = formikValueWithPrefix(props, "first.attribute");
  const attribute2 = formikValueWithPrefix(props, "second.attribute");

  if (attribute2 && attribute2.value) {
    const group1 = getAttributeGroup(attribute1);
    const group2 = getAttributeGroup(attribute2);
    if (group1 && group2 && group1.label !== group2.label) {
      // reset second attribute if the group is invalid
      setFieldValue(nameWithPrefix(props, "second.attribute.value"), '');
    }
  }
  const attributes2 = getAttributes2(attribute1);

  return (
    <div className="form-group">
      <div className="form-row">
        <ConstraintItemSelector prefix={nameWithPrefix(props, "first")} formik={props.formik} items={props.itemOptions} attributes={constraintAttributes} />
      </div>
      <div className="form-row">
        <select
          id={nameWithPrefix(props, "relation")}
          value={formikValueWithPrefix(props, "relation")}
          onChange={props.formik.handleChange}>
          <option value="0">Equal</option>
          <option value="1">Greater Than or Equal</option>
          <option value="2">Less Than or Equal</option>
        </select>
      </div>
      {
        attributes2.length > 0 ?
        <div className="form-row">
          <ConstraintItemSelector prefix={nameWithPrefix(props, "second")} formik={props.formik} items={props.itemOptions} attributes={attributes2} />
        </div>
        : null
      }
      <div className="form-row">
        <label className="input-title">
          Constant
        </label>
        <Field name={nameWithPrefix(props, "constant")} type="number" className={errors.constant && touched.constant ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <div className="form-row">
        <label className="input-title">
          Priority
        </label>
        <Field name={nameWithPrefix(props, "priority")} type="number" min={0} className={errors.priority && touched.priority ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <div className="form-row">
        <label className="input-title">
          Multiplier
        </label>
        <Field name={nameWithPrefix(props, "multiplier")} type="number" min={0} step={0.1} className={errors.multiplier && touched.multiplier ? 'full-width-input error' : 'full-width-input'} />
      </div>
      <div className="form-row">
        <label className="input-title">
          Installed
        </label>
        <Field name={nameWithPrefix(props, "isActive")} type="checkbox" checked={formikValueWithPrefix(props, "isActive")} className={errors.isActive && touched.isActive ? 'full-width-input error' : 'full-width-input'} />
      </div>
    </div>
  );
}

export default Constraint;