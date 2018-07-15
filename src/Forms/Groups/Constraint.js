import React from 'react';
import ConstraintItemSelector from '../Inputs/ConstraintItemSelector.js';
import { nameWithPrefix } from './Utils';

import './Groups.css';

const Constraint = props => {
  return (
    <div className="form-group">
      <div className="form-row">
        <ConstraintItemSelector prefix={nameWithPrefix(props, "first")} formik={props.formik} />
      </div>
    </div>
  );
}

export default Constraint;