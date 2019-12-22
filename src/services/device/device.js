// @flow
export type RemoteDeviceData = {
  online: boolean,
  name: string,
  host: string,
  port: number,
};

class RemoteDevice {
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

export default RemoteDevice;
