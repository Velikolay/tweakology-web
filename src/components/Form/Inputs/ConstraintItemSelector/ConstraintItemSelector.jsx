import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Field from '../Field/Field';
import ToggleButtonMenu from '../ToggleButtonMenu/ToggleButtonMenu';

import { withFormikContext } from '../../../../contexts/Form/FormikContext';
import { nameWithPrefix, formikValueWithPrefix } from '../../FormikHelpers';
import {
  attributeToModifiers,
  valueSwitch,
} from '../../../../Static/Constraints';

import './ConstraintItemSelector.scss';

const buildItemsDOM = (item, props) => {
  const itemsDOM = props.items.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
  if (!item.value && item.placeholder) {
    itemsDOM.unshift(
      <option key="" value="" disabled>
        {item.placeholder}
      </option>,
    );
  }
  return itemsDOM;
};

const variantFilter = (variant, attribute) => {
  if (attribute.value) {
    if (
      variant.relativeToMargin !== undefined &&
      attribute.relativeToMargin !== undefined &&
      variant.relativeToMargin !== attribute.relativeToMargin
    ) {
      return false;
    }
    if (
      variant.respectLanguageDirection !== undefined &&
      attribute.respectLanguageDirection !== undefined &&
      variant.respectLanguageDirection !== attribute.respectLanguageDirection
    ) {
      return false;
    }
  }
  return true;
};

const buildAttributeGroupsDOM = (attribute, props) => {
  const attributeGroupsDOM = [];

  if (!attribute.value) {
    attributeGroupsDOM.push(
      <option key="" value="" disabled>
        Attribute
      </option>,
    );
  }

  for (const group of props.attributes) {
    const variants = group.variants.filter(variant =>
      variantFilter(variant, attribute),
    );
    if (variants.length > 0) {
      const attributeDOM = variants[0].options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ));
      attributeGroupsDOM.push(
        <optgroup key={group.label} label={group.label}>
          {attributeDOM}
        </optgroup>,
      );
    }
  }
  return attributeGroupsDOM;
};

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
};

const ConstraintItemSelector = props => {
  const {
    prefix,
    disabled,
    attributes,
    onAttributeChange,
    formik: { setFieldValue, handleChange },
  } = props;

  const handleAttributeChange = e => {
    const attrVal = e.target.value;
    if (attrVal) {
      const [relativeToMargin, respectLanguageDirection] = attributeToModifiers[
        attrVal
      ];
      setFieldValue(
        nameWithPrefix(props, 'attribute.relativeToMargin'),
        relativeToMargin,
      );
      setFieldValue(
        nameWithPrefix(props, 'attribute.respectLanguageDirection'),
        respectLanguageDirection,
      );
    }
    handleChange(e);
    onAttributeChange(attrVal);
  };

  const item = formikValueWithPrefix(props, 'item');
  const attribute = formikValueWithPrefix(props, 'attribute');

  const handleSwitchModifier = (modifier, isOn) => {
    setFieldValue(nameWithPrefix(props, `attribute.${modifier}`), isOn);
    const modifierSwitch = valueSwitch[modifier];
    if (attribute.value in modifierSwitch) {
      setFieldValue(
        nameWithPrefix(props, 'attribute.value'),
        modifierSwitch[attribute.value],
      );
    }
  };

  const attributeGroupsDOM = buildAttributeGroupsDOM(attribute, props);
  const itemsDOM = buildItemsDOM(item, props);
  const modifiers = getModifiers(attribute, attributes);
  const hasModifiers = !!modifiers;

  return (
    <div className="cis-container">
      <Field
        className={cx('cis-item', {
          'with-modifiers': hasModifiers,
        })}
        component="select"
        name={nameWithPrefix(props, 'item.value')}
        disabled={disabled}
      >
        {itemsDOM}
      </Field>
      {/* <label>{'\u2024'}</label> */}
      <label>.</label>
      <Field
        className={cx('cis-attribute', {
          'with-modifiers': hasModifiers,
        })}
        component="select"
        name={nameWithPrefix(props, 'attribute.value')}
        onChange={handleAttributeChange}
        disabled={disabled}
      >
        {attributeGroupsDOM}
      </Field>
      {hasModifiers ? (
        <ToggleButtonMenu
          className="cis-options"
          prefix={`${prefix}.attribute`}
          onSwitch={handleSwitchModifier}
          disabled={disabled}
        >
          {modifiers.map(({ name, text }) => (
            <div key={name} name={name}>
              {text}
            </div>
          ))}
        </ToggleButtonMenu>
      ) : null}
    </div>
  );
};

ConstraintItemSelector.defaultProps = {
  disabled: false,
  onAttributeChange: () => {},
};

ConstraintItemSelector.propTypes = {
  prefix: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  formik: PropTypes.object.isRequired,
  attributes: PropTypes.array.isRequired,
  onAttributeChange: PropTypes.func,
};

export default withFormikContext(ConstraintItemSelector);
