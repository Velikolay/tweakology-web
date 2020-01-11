import React, { useContext } from 'react';
import { IconContext } from 'react-icons';
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from 'react-icons/fa';

import FormikContext from '../FormikContext';

import ToggleButtonMenu from '../Inputs/ToggleButtonMenu/ToggleButtonMenu';
import {
  nameWithPrefix,
  titleForField,
} from '../../../../../components/Formik';

import './Blocks.scss';

const alignmentOptions = [
  { value: 0, icon: <FaAlignLeft /> },
  { value: 1, icon: <FaAlignCenter /> },
  { value: 2, icon: <FaAlignRight /> },
  { value: 3, icon: <FaAlignJustify /> },
  { value: 4, icon: <div className="text-alignment-button-text">┅</div> },
];

const TextAlignment = props => {
  const { setFieldValue } = useContext(FormikContext);
  const textAlignment = nameWithPrefix(props, 'textAlignment');
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title" htmlFor={textAlignment}>
          {titleForField(props, 'textAlignment', 'Alignment')}
        </label>
        <IconContext.Provider
          value={{ className: 'text-alignment-button-icon' }}
        >
          <ToggleButtonMenu
            id={textAlignment}
            name={textAlignment}
            className="full-width-input"
            exclusiveMode
            onSwitch={(name, value) => setFieldValue(name, value)}
          >
            {alignmentOptions.map(({ value, icon }) => (
              <div key={value} value={value}>
                {icon}
              </div>
            ))}
          </ToggleButtonMenu>
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default TextAlignment;
