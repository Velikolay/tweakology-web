// @flow

export type RemoteDeviceData = {
  online: boolean,
  name: string,
  host: string,
  port: number,
};

export class RemoteDevice {
  online: boolean;

  name: string;

  host: string;

  port: number;

  constructor({ name, host, port, online }: RemoteDeviceData) {
    this.name = name;
    this.host = host;
    this.port = port;
    this.online = online;
  }

  getEndpoint(): string {
    return `http://${this.host}:${this.port}`;
  }
}

const genId = ({ name, host, port }: RemoteDeviceData): string =>
  `${name}-${host}-${port}`;

class DeviceConnector {
  devices: Map<string, RemoteDeviceData>;

  device: ?RemoteDeviceData;

  constructor() {
    this.devices = new Map();
  }

  isConnected() {
    return this.device ? this.device.online : false;
  }

  connect(device: RemoteDeviceData) {
    const id = genId(device);
    const stored = this.devices.get(id);
    if (stored && stored.online) {
      this.device = device;
    }
  }

  disconnect() {
    this.device = null;
  }

  update(device: RemoteDeviceData, autoconnect: boolean) {
    const id = genId(device);
    const stored = this.devices.get(id);
    if (stored) {
      stored.online = device.online;
    } else {
      this.devices.set(id, device);
    }
    if (!this.device && autoconnect) {
      this.device = device;
    }
    if (this.device && id === genId(this.device) && !device.online) {
      this.disconnect();
    }
  }

  getConnectedDevice(): ?RemoteDevice {
    return this.device ? new RemoteDevice(this.device) : null;
  }

  getConnectedDeviceData(): ?RemoteDeviceData {
    return this.device;
  }

  getDevices(): RemoteDeviceData[] {
    return Array.from(this.devices.values());
  }
}

export default DeviceConnector;
