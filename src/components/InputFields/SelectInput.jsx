// @flow
import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import PropTypes from 'prop-types';

import { deepValue } from '../Formik';

type OptionType = {
  [string]: any,
};
type OptionsType = OptionType[];

type SelectInputProps = {
  className?: string,
  placeholder?: string,
  disabled?: boolean,
  creatable?: boolean,
  isMulti?: boolean,
  options?: { value: any, label: string }[],
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
  const error = name && formik && name in formik.errors;

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

export const SelectInputUncontrolled = (
  props: SelectInputUncontrolledProps,
) => {
  const {
    className,
    placeholder,
    disabled,
    creatable,
    isMulti,
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
      onChange={onChange}
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
    options,
  } = props;
  const { values, setFieldValue } = formik;
  const SelectComponent = creatable ? Creatable : Select;
  return (
    // $FlowFixMe Createable bug!
    <SelectComponent
      className={className}
      isDisabled={disabled}
      isMulti={isMulti}
      styles={getStyles(name, formik)}
      value={deepValue(values, name)}
      placeholder={placeholder}
      options={options}
      onChange={value => setFieldValue(name, value || [])}
    />
  );
};

const commonPropTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  creatable: PropTypes.bool,
  isMulti: PropTypes.bool,
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

SelectInputControlled.defaultProps = commonDefaultProps;

export default SelectInputControlled;
