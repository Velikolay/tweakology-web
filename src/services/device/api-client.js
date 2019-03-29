// @flow
import type { DeviceFonts, DeviceSystemData, UITree } from './types';
import DeviceConnector, { RemoteDevice } from './connector';

class APIClient {
  deviceConnector: DeviceConnector;

  constructor(deviceConnector: DeviceConnector) {
    this.deviceConnector = deviceConnector;
  }

  remoteCall(invoke: any): any {
    const device: ?RemoteDevice = this.deviceConnector.getRemoteDevice();
    if (device) {
      const endpoint = device.getEndpoint();
      return invoke(endpoint);
    }
    return Promise.reject(new Error('No connection to device'));
  }

  fetchTree(): Promise<UITree> {
    return this.remoteCall(endpoint =>
      fetch(endpoint).then(response => response.json()),
    );
  }

  fetchSystemData(): Promise<DeviceSystemData> {
    return this.remoteCall(endpoint =>
      fetch(`${endpoint}/fonts`)
        .then(response => response.json())
        .then((fonts: DeviceFonts) => ({ fonts })),
    );
  }

  submitChanges(name: string, changes: any) {
    return this.remoteCall(endpoint =>
      fetch(`${endpoint}/tweaks/${name}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      }),
    );
  }
}

export default APIClient;
