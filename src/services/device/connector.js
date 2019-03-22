// @flow
import type { DeviceFonts, DeviceSystemData, UITree } from './types';

export type RemoteDevice = {
  online: boolean,
  name: string,
  host: string,
  port: number,
};

const genId = ({ name, host, port }: RemoteDevice): string =>
  `${name}-${host}-${port}`;

class DeviceConnector {
  devices: { [id: string]: RemoteDevice };

  device: ?RemoteDevice;

  endpoint: ?string;

  constructor() {
    this.devices = {};
  }

  isConnected() {
    return this.device ? this.device.online : false;
  }

  updateRemoteDevice(device: RemoteDevice) {
    if (!this.device) {
      const { host, port } = device;
      this.device = device;
      this.endpoint = `http://${host}:${port}`;
    }

    const id = genId(device);
    if (id in this.devices) {
      this.devices[id].online = device.online;
    } else {
      this.devices[id] = device;
    }
  }

  fetchTree(): Promise<UITree> {
    if (this.endpoint) {
      return fetch(this.endpoint).then(response => response.json());
    }
    return Promise.reject(new Error('No connection to device'));
  }

  fetchSystemData(): Promise<DeviceSystemData> {
    if (this.endpoint) {
      return fetch(`${this.endpoint}/fonts`)
        .then(response => response.json())
        .then((fonts: DeviceFonts) => ({ fonts }));
    }
    return Promise.reject(new Error('No connection to device'));
  }

  submitChanges(name: string, changes: any) {
    if (this.endpoint) {
      return fetch(`${this.endpoint}/tweaks/${name}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      });
    }
    return Promise.reject(new Error('No connection to device'));
  }
}

export default DeviceConnector;
