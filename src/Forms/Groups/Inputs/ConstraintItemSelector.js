import React from 'react';
import cx from 'classnames';
import ToggleButtonMenu from './ToggleButtonMenu.js';
import { nameWithPrefix, formikValueWithPrefix } from '../Utils';
import { attributeToModifiers, valueSwitch } from '../../Static/Constraints'

import './ConstraintItemSelector.css';

const ConstraintItemSelector = (props) => {
  const {
    setFieldValue,
    handleChange
  } = props.formik;

  const handleAttributeChange = (e) => {
    const attrVal = e.target.value;
    console.log('handleAttributeChange ' + attrVal);
    if (attrVal) {
      const modifiers = attributeToModifiers[attrVal];
      setFieldValue(nameWithPrefix(props, 'attribute.relativeToMargin'), modifiers[0]);
      setFieldValue(nameWithPrefix(props, 'attribute.respectLanguageDirection'), modifiers[1]);
    }
    handleChange(e);
  }

  const item = formikValueWithPrefix(props, 'item');
  const attribute = formikValueWithPrefix(props, 'attribute');

  const handleSwitchModifier = (modifier, isOn) => {
    console.log(nameWithPrefix(props, `attribute.${modifier}`));
    setFieldValue(nameWithPrefix(props, `attribute.${modifier}`), isOn);
    const modifierSwitch = valueSwitch[modifier];
    if (attribute.value in modifierSwitch) {
      setFieldValue(nameWithPrefix(props, 'attribute.value'), modifierSwitch[attribute.value]);
    }
  }

  console.log(attribute);

  const attributeGroupsDOM = buildAttributeGroupsDOM(attribute, props);
  const itemsDOM = buildItemsDOM(item, props);
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
          onChange={handleAttributeChange}>
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
            onSwitch={handleSwitchModifier}
          />
        </div>
        :
        null
      }
    </div>
  );
};

const buildItemsDOM = (item, props) => {
  const itemsDOM = [];
  if (!item.value && item.placeholder) {
    itemsDOM.push(
      <option value="" disabled selected>{item.placeholder}</option>
    );
  }
  const _itemsDOM = item.options.map(option => <option value={option.value}>{option.label}</option>);
  itemsDOM.push(..._itemsDOM);
  return itemsDOM;
}

const buildAttributeGroupsDOM = (attribute, props) => {
  const attributeGroupsDOM = [];

  if (!attribute.value) {
    attributeGroupsDOM.push(
      <option value="" disabled selected>Attribute</option>
    );
  }

  for (const group of props.attributes) {
    const variants = group.variants.filter(variant => variantFilter(variant, attribute));
    if (variants.length > 0) {
      const attributeDOM = variants[0].options.map(option => <option value={option.value}>{option.label}</option>);
      attributeGroupsDOM.push(
        <optgroup label={group.label}>
          {attributeDOM}
        </optgroup>
      );
    }
  }
  return attributeGroupsDOM;
}

const getModifiers = (attribute, attributeGroups) => {
  for (const group of attributeGroups) {
    for (const variant of group.variants) {
      for (const option of variant.options) {
        if (attribute.value === option.value) {
          return group.modifiers;
        }
      }
    }
  }
  return false;
}

const variantFilter = (variant, attribute) => {
  if (attribute.value) {
    if (variant.relativeToMargin !== undefined &&
      attribute.relativeToMargin !== undefined &&
      variant.relativeToMargin !== attribute.relativeToMargin) {
      return false;
    }
    if (variant.respectLanguageDirection !== undefined &&
      attribute.respectLanguageDirection !== undefined &&
      variant.respectLanguageDirection !== attribute.respectLanguageDirection) {
      return false;
    }
  }
  return true;
}

export default ConstraintItemSelector;