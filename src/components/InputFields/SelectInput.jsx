// @flow
import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import PropTypes from 'prop-types';

import './SelectInput.scss';

type SelectInputProps = {
  options: { value: string, label: string }[],
  onChange: () => void,
  placeholder: string,
  disabled: boolean,
  creatable: boolean,
};

type FormikProps = {
  values: any,
  errors: any,
  setFieldValue: (string, { value: string, label: string }[]) => void,
};

type FormikSelectInputProps = {
  name: string,
  formik: FormikProps,
  options: { value: string, label: string }[],
  placeholder: string,
  disabled: boolean,
  creatable: boolean,
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

const SelectInput = (props: SelectInputProps) => {
  const {
    placeholder,
    disabled,
    creatable,
    onChange,
    options,
    ...rest
  } = props;
  const SelectComponent = creatable ? Creatable : Select;
  return (
    <SelectComponent
      isDisabled={disabled}
      styles={getStyles()}
      placeholder={placeholder}
      onChange={onChange}
      options={options}
      {...rest}
    />
  );
};

export const FormikSelectInput = (props: FormikSelectInputProps) => {
  const {
    name,
    placeholder,
    disabled,
    creatable,
    formik,
    options,
    ...rest
  } = props;
  const { values, setFieldValue } = formik;
  const SelectComponent = creatable ? Creatable : Select;
  return (
    <SelectComponent
      isDisabled={disabled}
      styles={getStyles(name, formik)}
      value={values[name]}
      placeholder={placeholder}
      onChange={value => setFieldValue(name, value !== null ? value : [])}
      options={options}
      {...rest}
    />
  );
};

SelectInput.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  creatable: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

SelectInput.defaultProps = {
  onChange: () => {},
  placeholder: '',
  disabled: false,
  creatable: false,
  options: [],
};

FormikSelectInput.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  creatable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

FormikSelectInput.defaultProps = {
  placeholder: '',
  disabled: false,
  creatable: false,
  options: [],
};

export default SelectInput;
