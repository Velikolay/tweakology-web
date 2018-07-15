import React from 'react';
import cx from 'classnames';
import ToggleButtonMenu from './ToggleButtonMenu.js';
import { nameWithPrefix, formikValueWithPrefix } from '../Groups/Utils';

import './ConstraintItemSelector.css';

const ConstraintItemSelector = (props) => {
  const {
    handleChange,
    setFieldValue
  } = props.formik;

  const hasOptions = (attribute, attributeGroups) => {
    for (const group of attributeGroups) {
      for (const option of group.options) {
        if (attribute.value === option.value) {
          return group.hasExtraOptions ? true : false;
        }
      }
    }
    return false;
  }

  console.log(props);
  const item = formikValueWithPrefix(props, 'item')
  const attribute = formikValueWithPrefix(props, 'attribute')

  console.log(item);
  console.log(attribute);

  const attributeGroupsDOM = []
  if (!attribute.value && attribute.placeholder) {
    attributeGroupsDOM.push(
      <option value="" disabled selected>{attribute.placeholder}</option>
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

  const showOptions = hasOptions(attribute, props.attributes);

  return (
    <div className="cis-container">
      <div className={cx('cis-item', {
        'with-options': showOptions
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
        'with-options': showOptions
      })}>
        <select
          id={nameWithPrefix(props, 'attribute.value')}
          value={attribute.value}
          onChange={handleChange}>
          {attributeGroupsDOM}
        </select>
      </div>
      {
        showOptions ?
        <div className='cis-options'>
          <ToggleButtonMenu
            prefix={`${props.prefix}.attribute`}
            options={[
              { name: 'relativeToMargin', text: 'M', isActive: attribute.relativeToMargin },
              { name: 'respectLanguageDirection', text: 'L', isActive: attribute.respectLanguageDirection }
            ]}
            setFieldValue={setFieldValue}
          />
        </div>
        :
        null
      }
    </div>
  );
};

export default ConstraintItemSelector;