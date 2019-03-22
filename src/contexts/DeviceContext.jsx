import React from 'react';

const DeviceContext = React.createContext();

export const withDeviceContext = Component => props => (
  <DeviceContext.Consumer>
    {device => <Component {...props} device={device} />}
  </DeviceContext.Consumer>
);

export default DeviceContext;
