import React from 'react';
import cx from 'classnames';
import ToggleButtonMenu from './ToggleButtonMenu.js';
import { nameWithPrefix, formikValueWithPrefix } from '../Groups/Utils';

import './ConstraintItemSelector.css';

const ConstraintItemSelector = (props) => {
  const {
    handleChange
  } = props.formik;

  const getModifiers = (attribute, attributeGroups) => {
    for (const group of attributeGroups) {
      for (const option of group.options) {
        if (attribute.value === option.value) {
          return group.modifiers;
        }
      }
    }
    return false;
  }

  const item = formikValueWithPrefix(props, 'item')
  const attribute = formikValueWithPrefix(props, 'attribute')

  // console.log(item);
  // console.log(attribute);

  const attributeGroupsDOM = []
  if (!attribute.value) {
    attributeGroupsDOM.push(
      <option value="" disabled selected>Attribute</option>
    )
  }
  for (const group of props.attributes) {
    const attributeDOM = group.options.map(option => <option value={option.value}>{option.label}</option>);

    attributeGroupsDOM.push(
      <optgroup label={group.label}>
        {attributeDOM}
      </optgroup>
    )
  }

  const itemsDOM = []
  if (!item.value && item.placeholder) {
    itemsDOM.push(
      <option value="" disabled selected>{item.placeholder}</option>
    )
  }
  const _itemsDOM = item.options.map(option => <option value={option.value}>{option.label}</option>);
  itemsDOM.push(..._itemsDOM);

  const modifiers = getModifiers(attribute, props.attributes);
  const hasModifiers = modifiers ? true : false;
  return (
    <div className="cis-container">
      <div className={cx('cis-item', {
        'with-modifiers': hasModifiers
      })}>
        <select
          id={nameWithPrefix(props, 'item.value')}
          value={item.value}
          onChange={handleChange}>
          {itemsDOM}
        </select>
      </div>
      {/* <label>{'\u2024'}</label> */}
      <label>.</label>
      <div className={cx('cis-attribute', {
        'with-modifiers': hasModifiers
      })}>
        <select
          id={nameWithPrefix(props, 'attribute.value')}
          value={attribute.value}
          onChange={handleChange}>
          {attributeGroupsDOM}
        </select>
      </div>
      {
        hasModifiers ?
        <div className='cis-options'>
          <ToggleButtonMenu
            prefix={`${props.prefix}.attribute`}
            options={modifiers}
            formik={props.formik}
          />
        </div>
        :
        null
      }
    </div>
  );
};

export default ConstraintItemSelector;