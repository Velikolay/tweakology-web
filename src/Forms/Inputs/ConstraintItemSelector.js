import React from 'react';
import cx from 'classnames';
import ToggleButtonMenu from './ToggleButtonMenu.js';

import './ConstraintItemSelector.css';

const ConstraintItemSelector = (props) => {

  const hasOptions = (attribute) => {
    for (const group of attribute.groups) {
      for (const option of group.options) {
        if (attribute.value === option.value) {
          return option.hasOptions ? true : false;
        }
      }
    }
    return false;
  }

  const attributeGroupsDOM = []
  if (!props.attribute.value) {
    attributeGroupsDOM.push(
      <option value="" disabled selected>Attribute</option>
    )
  }
  for (const group of props.attribute.groups) {
    const attributeDOM = group.options.map(option => {
      return option.value === props.attribute.value ? <option selected value={option.value}>{option.label}</option> : <option value={option.value}>{option.label}</option>
    });

    attributeGroupsDOM.push(
      <optgroup label={group.label}>
        {attributeDOM}
      </optgroup>
    )
  }

  const itemsDOM = []
  if (!props.item.value) {
    itemsDOM.push(
      <option value="" disabled selected>First Item</option>
    )
  }
  const _itemsDOM = props.item.options.map(option => {
    return option.value === props.item.value ? <option selected value={option.value}>{option.label}</option> : <option value={option.value}>{option.label}</option>
  });
  itemsDOM.push(..._itemsDOM);

  const showOptions = hasOptions(props.attribute);

  return (
    <div className="cis-container">
      <div className={cx('cis-item', {
        'with-options': showOptions
      })}>
        <select onChange={onChange}>
          {itemsDOM}
        </select>
      </div>
      <label>{'\u2024'}</label>
      {/* <label>.</label> */}
      <div className={cx('cis-attribute', {
        'with-options': showOptions
      })}>
        <select onChange={onChange}>
          {attributeGroupsDOM}
        </select>
      </div>
      {
        showOptions ?
        <div className='cis-options'>
          <ToggleButtonMenu
            options={[
              { text: 'M', isActive: true },
              { text: 'L', isActive: false }
            ]}
          />
        </div>
        :
        null
      }
    </div>
  );
};

const onChange = (e) => {
  console.log(e.target.value);
}

export default ConstraintItemSelector;