// @flow
import React from 'react';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import PropTypes from 'prop-types';

import './SelectInput.scss';

const contentColorStyle = provided => ({
  ...provided,
  color: '#c8c8c8',
});

const customStyles = {
  control: provided => ({
    ...provided,
    backgroundColor: '#3c3f41',
    border: '1px solid #846937',
    color: '#c8c8c8',
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

type SelectInputProps = {
  options: { value: string, label: string }[],
  onChange: () => void,
  placeholder: string,
  disabled: boolean,
  creatable: boolean,
};

type FormikSelectInputProps = {
  name: string,
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
  options: { value: string, label: string }[],
  placeholder: string,
  disabled: boolean,
  creatable: boolean,
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
      styles={customStyles}
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
    formik: { setFieldValue, values },
    options,
    ...rest
  } = props;
  const SelectComponent = creatable ? Creatable : Select;
  return (
    <SelectComponent
      isDisabled={disabled}
      styles={customStyles}
      value={values[name]}
      placeholder={placeholder}
      onChange={value => setFieldValue(name, value)}
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
