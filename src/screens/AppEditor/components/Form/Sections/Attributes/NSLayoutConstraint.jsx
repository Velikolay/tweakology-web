import React from 'react';

import { FormDataShape } from '../../Shapes';
import NSLayoutConstraint from '../../Blocks/NSLayoutConstraint';

const NSLayoutConstraintAttributes = ({ formData }) => (
  <NSLayoutConstraint itemOptions={formData.itemOptions} />
);

NSLayoutConstraintAttributes.propTypes = {
  formData: FormDataShape.isRequired,
};

export default NSLayoutConstraintAttributes;
