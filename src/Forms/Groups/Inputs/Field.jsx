import React from 'react';
import { Field as FormikField } from 'formik';
import cx from 'classnames';

import { withFormikContext } from '../../FormikContext';
import { isValueDirty } from '../Utils';

const Field = props => {
  const { name, className, ...rest } = props;
  const newClassName = cx(className, {
    'is-dirty': isValueDirty(props, name),
  });

  return <FormikField name={name} className={newClassName} {...rest} />;
};

export default withFormikContext(Field);
