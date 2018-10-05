import React from 'react';
import { IconContext } from 'react-icons';
import {
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from 'react-icons/fa';

import ToggleButtonMenu from './Inputs/ToggleButtonMenu';
import { nameWithPrefix, titleForField } from './Utils';
import { withFormikContext } from '../FormikContext';

import './Groups.css';
import './TextAlignment.css';

const alignmentOptions = [
  { value: 0, icon: <FaAlignLeft /> },
  { value: 1, icon: <FaAlignCenter /> },
  { value: 2, icon: <FaAlignRight /> },
  { value: 3, icon: <FaAlignJustify /> },
  { value: 4, icon: <div className="text-alignment-button-text">┅</div> },
];

const TextAlignmentGroup = (props) => {
  const { formik: { setFieldValue } } = props;
  return (
    <div className="form-group">
      <div className="form-row">
        <label className="input-title">
          {titleForField(props, 'textAlignment', 'Alignment')}
        </label>
        <IconContext.Provider value={{ className: 'text-alignment-button-icon' }}>
          <ToggleButtonMenu
            className="full-width-input"
            exclusiveMode
            name={nameWithPrefix(props, 'textAlignment')}
            onSwitch={(name, value) => setFieldValue(name, value)}
          >
            {alignmentOptions.map(({ value, icon }) => <div key={value} value={value}>{icon}</div>)}
          </ToggleButtonMenu>
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default withFormikContext(TextAlignmentGroup);
