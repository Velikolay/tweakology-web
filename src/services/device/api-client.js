// @flow
import type {
  DeviceSystemData,
  DeviceRuntimeData,
  DeviceUITreeData,
} from './types';
import RemoteDevice from './device';
import DeviceConnector from './connector';

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

  fetchRuntimeData(): Promise<DeviceRuntimeData> {
    return this.remoteCall(endpoint =>
      fetch(`${endpoint}/runtime`).then(response => response.json()),
    );
  }

  fetchSystemData(): Promise<DeviceSystemData> {
    return this.remoteCall(endpoint =>
      fetch(`${endpoint}/system`).then(response => response.json()),
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
