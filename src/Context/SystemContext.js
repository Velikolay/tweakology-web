import React from 'react';

const SystemContext = React.createContext();

export const withSystemContext = Component => (
  props => (
    <SystemContext.Consumer>
      {systemContext => <Component {...props} systemContext={systemContext} />}
    </SystemContext.Consumer>
  )
);

export default SystemContext;
