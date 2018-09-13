import React from 'react';

const FormikContext = React.createContext();

export const withFormikContextProvider = Component => (
  props => (
    <FormikContext.Provider value={props}>
      <Component {...props} />
    </FormikContext.Provider>
  )
);

export const withFormikContext = Component => (
  props => (
    <FormikContext.Consumer>
      {formik => <Component {...props} formik={formik} />}
    </FormikContext.Consumer>
  )
);

export default FormikContext;
