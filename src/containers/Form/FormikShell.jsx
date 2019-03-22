import React from 'react';
// import PropTypes from 'prop-types';

import FormikPersistence from './Presistence';
import FormikObserver from './Observer';

// eslint-disable-next-line import/prefer-default-export
export const withFormikShell = Component => props => {
  const { id, type, handleSubmit, onFormUpdate } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Component {...props} />
      <FormikObserver
        onChange={({ values }) => onFormUpdate(id, type, values)}
      />
      <FormikPersistence name={id} />
    </form>
  );
};
