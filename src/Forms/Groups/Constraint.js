import React from 'react';
import ConstraintItemSelector from '../Inputs/ConstraintItemSelector.js';
import { nameWithPrefix, formikValueWithPrefix } from './Utils';
import { Field } from 'formik';

import './Groups.css';

const attributeGroups = [
  {
    label: 'Vertical Space',
    options: [
      { label: 'Top', value: 'top' },
      { label: 'Center Y', value: 'centery' },
      { label: 'First Baseline', value: 'firstbaseline' },
      { label: 'Last Baseline', value: 'lastbaseline' },
      { label: 'Bottom', value: 'bottom' },
    ],
    modifiers: [
      { name: 'relativeToMargin', text: 'M' }
    ]
  },
  {
    label: 'Horizontal Space',
    options: [
      { label: 'Leading', value: 'leading' },
      { label: 'Center X', value: 'centerx' },
      { label: 'Trailing', value: 'trailing' }
    ],
    modifiers: [
      { name: 'relativeToMargin', text: 'M' },
      { name: 'respectLanguageDirection', text: 'L' }
    ]
  },
  {
    label: 'Size',
    options: [
      { label: 'Width', value: 'width'},
      { label: 'Height', value: 'height'}
    ]
  },
];

const getAttributeGroup = (itemAttribute) => {
  for (const group of attributeGroups) {
    for (const option of group.options) {
      if (itemAttribute === option.value) {
        return group;
      }
    }
  }
  return null;
}

const getSecondGroupAttributes = (firstItemAttribute) => {
  const group = getAttributeGroup(firstItemAttribute);
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

  const firstItemAttribute = formikValueWithPrefix(props, "first.attribute.value");
  const secondItemAttribute = formikValueWithPrefix(props, "second.attribute.value");
  if (secondItemAttribute) {
    const firstGroup = getAttributeGroup(firstItemAttribute);
    const secondGroup = getAttributeGroup(secondItemAttribute);
    if (firstGroup && secondGroup && firstGroup.label !== secondGroup.label) {
      setFieldValue(nameWithPrefix(props, "second.attribute.value"), '');
    }
  }
  const secondGroupAttributes = getSecondGroupAttributes(firstItemAttribute);
  return (
    <div className="form-group">
      <div className="form-row">
        <ConstraintItemSelector prefix={nameWithPrefix(props, "first")} formik={props.formik} attributes={attributeGroups} />
      </div>
      <div className="form-row">
        <select
          id={nameWithPrefix(props, "relation")}
          value={formikValueWithPrefix(props, "relation")}
          onChange={props.formik.handleChange}>
          <option value="eq">Equal</option>
          <option value="gte">Greater Than or Equal</option>
          <option value="lte">Less Than or Equal</option>
        </select>
      </div>
      {
        secondGroupAttributes.length > 0 ?
        <div className="form-row">
          <ConstraintItemSelector prefix={nameWithPrefix(props, "second")} formik={props.formik} attributes={secondGroupAttributes} />
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
    </div>
  );
}

export default Constraint;