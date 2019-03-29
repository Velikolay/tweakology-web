// @flow

type RemoteDeviceData = {
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

const genId = ({ name, host, port }: RemoteDevice): string =>
  `${name}-${host}-${port}`;

class DeviceConnector {
  devices: { [id: string]: RemoteDevice };

  device: ?RemoteDevice;

  constructor() {
    this.devices = {};
  }

  isConnected() {
    return this.device ? this.device.online : false;
  }

  updateRemoteDevice(device: RemoteDevice) {
    if (!this.device) {
      this.device = device;
    }

    const id = genId(device);
    if (id in this.devices) {
      this.devices[id].online = device.online;
    } else {
      this.devices[id] = device;
    }
  }

  getRemoteDevice(): ?RemoteDevice {
    return this.device;
  }
}

export default DeviceConnector;
