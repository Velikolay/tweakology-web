import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Field as FormikField } from 'formik';
import cx from 'classnames';

import FormikContext from '../../../contexts/FormikContext';
import { isValueDirty } from '../FormikHelpers';

const Field = props => {
  const { name, className, ...rest } = props;
  const formik = useContext(FormikContext);
  const newClassName = cx(className, {
    'is-dirty': isValueDirty(formik, props, name),
  });

  return <FormikField name={name} className={newClassName} {...rest} />;
};

Field.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Field.defaultProps = {
  className: '',
};

export default Field;
