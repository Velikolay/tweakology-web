// @flow
import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import PropTypes from 'prop-types';

import { deepValue } from '../Formik';

type OptionType = {
  value: any,
  label: string,
};
type OptionsType = OptionType[];

type SelectInputProps = {
  className?: string,
  placeholder?: string,
  disabled?: boolean,
  creatable?: boolean,
  isMulti: boolean,
  valueOnly: boolean,
  options?: OptionsType,
};

type SelectInputUncontrolledProps = SelectInputProps & {
  onChange: any => void,
};

type FormikProps = {
  values: any,
  errors: any,
  setFieldValue: (string, OptionType | OptionsType) => void,
};

type SelectInputControlledProps = SelectInputProps & {
  name: string,
  formik: FormikProps,
};

const getStyles = (name: ?string, formik: ?FormikProps): any => {
  const error = name && formik && deepValue(formik.errors, name);

  const controlBorderShadow = provided =>
    'borderBox' in provided && !error ? provided.borderBox : 'none';

  const controlBorder = provided =>
    !error ? '1px solid #846937' : '1px solid #e98675';

  const contentColorStyle = provided => ({
    ...provided,
    color: '#c8c8c8',
  });
  return {
    control: provided => ({
      ...provided,
      backgroundColor: '#3c3f41',
      border: controlBorder(provided),
      color: '#c8c8c8',
      boxShadow: controlBorderShadow(provided),
    }),
    input: contentColorStyle,
    singleValue: contentColorStyle,
    clearIndicator: contentColorStyle,
    dropdownIndicator: contentColorStyle,
    menu: provided => ({
      ...provided,
      backgroundColor: '#3c3f41',
    }),
    option: (provided, { isFocused }) => ({
      ...provided,
      color: '#c8c8c8',
      backgroundColor: isFocused ? '#0071b8' : '#3c3f41',
    }),
  };
};

const toValue = (option: OptionType, valueOnly: boolean): any =>
  valueOnly ? option.value : option;

const toMultiValue = (option: OptionsType, valueOnly: boolean): any =>
  (option || []).map(x => (valueOnly ? x.value : x));

const toOption = (value: any, valueOnly: boolean): OptionType =>
  valueOnly ? { value, label: value } : value;

const toMultiOption = (value: any, valueOnly: boolean): OptionsType =>
  valueOnly ? value.map(x => ({ value: x, label: x })) : value;

export const SelectInputUncontrolled = (
  props: SelectInputUncontrolledProps,
) => {
  const {
    className,
    placeholder,
    disabled,
    creatable,
    isMulti,
    valueOnly,
    options,
    onChange,
  } = props;
  const SelectComponent = creatable ? Creatable : Select;
  return (
    // $FlowFixMe Createable bug!
    <SelectComponent
      className={className}
      isDisabled={disabled}
      isMulti={isMulti}
      styles={getStyles()}
      placeholder={placeholder}
      options={options}
      onChange={option =>
        onChange(
          isMulti
            ? toMultiValue(option, valueOnly)
            : toValue(option, valueOnly),
        )
      }
    />
  );
};

const SelectInputControlled = (props: SelectInputControlledProps) => {
  const {
    name,
    formik,
    className,
    placeholder,
    disabled,
    creatable,
    isMulti,
    valueOnly,
    options,
  } = props;
  const { values, setFieldValue } = formik;
  const value = deepValue(values, name);
  const SelectComponent = creatable ? Creatable : Select;
  return (
    // $FlowFixMe Createable bug!
    <SelectComponent
      className={className}
      isDisabled={disabled}
      isMulti={isMulti}
      styles={getStyles(name, formik)}
      value={
        isMulti ? toMultiOption(value, valueOnly) : toOption(value, valueOnly)
      }
      placeholder={placeholder}
      options={options}
      onChange={option =>
        setFieldValue(
          name,
          isMulti
            ? toMultiValue(option, valueOnly)
            : toValue(option, valueOnly),
        )
      }
    />
  );
};

const commonPropTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  creatable: PropTypes.bool,
  isMulti: PropTypes.bool,
  valueOnly: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

const commonDefaultProps = {
  className: '',
  placeholder: '',
  disabled: false,
  creatable: false,
  isMulti: false,
  valueOnly: false,
  options: [],
};

SelectInputUncontrolled.propTypes = {
  onChange: PropTypes.func,
  ...commonPropTypes,
};

SelectInputUncontrolled.defaultProps = {
  onChange: () => {},
  ...commonDefaultProps,
};

SelectInputControlled.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.objectOf(PropTypes.any).isRequired,
  ...commonPropTypes,
};

SelectInputControlled.defaultProps = {
  ...commonDefaultProps,
};

export default SelectInputControlled;
