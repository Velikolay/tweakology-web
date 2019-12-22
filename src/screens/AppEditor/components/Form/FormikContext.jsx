import React from 'react';

const FormikContext = React.createContext();

export const withFormikContextProvider = Component => props => (
  <FormikContext.Provider value={props}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Component {...props} />
  </FormikContext.Provider>
);

export const withFormikContext = Component => props => (
  <FormikContext.Consumer>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    {formik => <Component {...props} formik={formik} />}
  </FormikContext.Consumer>
);

export default FormikContext;
