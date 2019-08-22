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

// const heightStyle = {
//   'min-height': '22px',
//   height: '22px',
// };

const customStyles = {
  control: provided => ({
    ...provided,
    backgroundColor: '#3c3f41',
    border: '1px solid #846937',
    color: '#c8c8c8',
    // ...heightStyle,
  }),
  input: contentColorStyle,
  clearIndicator: contentColorStyle,
  dropdownIndicator: contentColorStyle,
  menu: provided => ({
    ...provided,
    backgroundColor: '#3c3f41',
  }),
  // valueContainer: provided => ({
  //   ...heightStyle,
  // }),
  // indicatorsContainer: provided => ({
  //   ...heightStyle,
  // }),
  option: (provided, { isFocused }) => ({
    ...provided,
    color: '#c8c8c8',
    backgroundColor: isFocused ? '#0071b8' : '#3c3f41',
  }),
};

type SelectInputProps = {
  name: string,
  placeholder?: string,
  creatable?: boolean,
  options: { value: string, label: string }[],
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
};

const SelectInput = (props: SelectInputProps) => {
  const {
    name,
    placeholder,
    creatable,
    formik: { setFieldValue, values },
    options,
    ...rest
  } = props;
  const SelectComponent = creatable ? Creatable : Select;
  return (
    <SelectComponent
      styles={customStyles}
      value={values[name]}
      placeholder={placeholder}
      onChange={value => setFieldValue(name, value)}
      options={options}
      {...rest}
    />
  );
};

// const AutosuggestInput = (props: AutosuggestInputProps) => {
//   const {
//     name,
//     placeholder,
//     className,
//     suggestions,
//     currentValue,
//     ...rest
//   } = props;
//   const [focus, setFocus] = useState(false);
//   return (
//     <div>
//       <Field
//         className={cx('AutosuggestInput', className)}
//         name={name}
//         placeholder={placeholder}
//         onFocus={() => setFocus(true)}
//         onBlur={() => setFocus(false)}
//         // onChange={event => setValue(event.target.value)}
//         {...rest}
//       />
//       {focus ? (
//         <ul className="AutosuggestInput__suggestions">
//           {suggestions
//             .filter(item => item.includes(currentValue))
//             .map(item => (
//               <li className="AutosuggestInput__suggestions__item" key={item}>
//                 {item}
//               </li>
//             ))}
//         </ul>
//       ) : null}
//     </div>
//   );
// };

SelectInput.propTypes = {
  placeholder: PropTypes.string,
  creatable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

SelectInput.defaultProps = {
  placeholder: '',
  creatable: false,
  options: [],
};

export default SelectInput;
