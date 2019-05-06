// @flow
import type { DeviceFonts, DeviceSystemData, DeviceUITreeData } from './types';
import DeviceConnector, { RemoteDevice } from './connector';

class APIClient {
  deviceConnector: DeviceConnector;

  constructor(deviceConnector: DeviceConnector) {
    this.deviceConnector = deviceConnector;
  }

  getEndpoint(): ?string {
    const device: ?RemoteDevice = this.deviceConnector.getConnectedDevice();
    return device ? device.getEndpoint() : null;
  }

  remoteCall(invoke: string => Promise<any>): Promise<any> {
    const endpoint = this.getEndpoint();
    return endpoint
      ? invoke(endpoint)
      : Promise.reject(new Error('No connection to device'));
  }

  fetchTree(): Promise<DeviceUITreeData> {
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

  submitChanges(name: string, changes: any): Promise<any> {
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
