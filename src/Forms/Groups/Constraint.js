import React from 'react';
import ConstraintItemSelector from '../Inputs/ConstraintItemSelector.js';
import { nameWithPrefix, formikValueWithPrefix } from './Utils';

import './Groups.css';

const attributeGroups = [
  {
    label: 'Vertical Space',
    options: [
      { label: 'Top', value: 'top' },
      { label: 'Bottom', value: 'bottom' },
    ],
    hasExtraOptions: true
  },
  {
    label: 'Horizontal Space',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Right', value: 'right' }
    ],
    hasExtraOptions: true
  },
  {
    label: 'Size',
    options: [
      { label: 'Width', value: 'width'},
      { label: 'Height', value: 'height'}
    ]
  },
];

const getSecondGroupAttributes = (firstItemAttribute) => {
  if(!firstItemAttribute) {
    return attributeGroups;
  }
  for (const group of attributeGroups) {
    if (group.label !== 'Size') {
      for (const option of group.options) {
        if (firstItemAttribute === option.value) {
          return [group];
        }
      }
    }
  }
  return [];
}

const Constraint = props => {
  const firstItemAttribute = formikValueWithPrefix(props, "first.attribute.value");
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
    </div>
  );
}

export default Constraint;