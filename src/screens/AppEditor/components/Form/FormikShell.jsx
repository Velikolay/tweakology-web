import React from 'react';
import PropTypes from 'prop-types';

import Persistence from '../../../../components/Formik/Presistence';
import Observer from '../../../../components/Formik/Observer';

// eslint-disable-next-line import/prefer-default-export
export const withFormikShell = Component => {
  const formikShell = props => {
    const { id, type, handleSubmit, eventHandler } = props;
    return (
      <form onSubmit={handleSubmit}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...props} />
        <Observer
          formik={props}
          onChange={({ values }) =>
            eventHandler('update', { id, type, values })
          }
        />
        <Persistence
          name={id}
          formik={props}
          onChange={formikBag => eventHandler('select', formikBag)}
        />
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
