import React from 'react';
import FormikObserver from 'formik-observer';
import Persist from './Persistence/Presistence';

// eslint-disable-next-line import/prefer-default-export
export const withFormikShell = Component => props => {
  const { id, type, handleSubmit, onFormUpdate } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Component {...props} />
      <FormikObserver
        onChange={({ values }) => onFormUpdate(id, type, values)}
      />
      <Persist name={id} />
    </form>
  );
};
