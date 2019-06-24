import React from 'react';
import PropTypes from 'prop-types';

import FormikPersistence from './Presistence';
import FormikObserver from './Observer';

// eslint-disable-next-line import/prefer-default-export
export const withFormikShell = Component => {
  const formikShell = props => {
    const { id, type, handleSubmit, eventHandler } = props;
    return (
      <form onSubmit={handleSubmit}>
        <Component {...props} />
        <FormikObserver
          onChange={({ values }) =>
            eventHandler('update', { id, type, values })
          }
        />
        <FormikPersistence name={id} />
      </form>
    );
  };

  formikShell.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    eventHandler: PropTypes.func.isRequired,
  };
  return formikShell;
};
