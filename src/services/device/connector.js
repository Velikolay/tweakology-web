// @flow
import debounce from 'lodash.debounce';
import PersistenceService from '../persistence';

const DEVICE_HISTORY_PERSISTENCE_KEY = 'DeviceHistory';
const AUTOCONNECT_MAX_WAIT_MILLIS = 3 * 1000;

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

export type AutoconnectHandlerFunc = (device: RemoteDevice) => void;

export type DeviceConnectorSettings = {
  autoconnect?: boolean,
  autoconnectHandler?: AutoconnectHandlerFunc,
};

const genId = ({ name, host, port }: RemoteDeviceData): string =>
  `${name}-${host}-${port}`;

class DeviceConnector {
  devices: Map<string, RemoteDeviceData> = new Map();

  device: ?RemoteDeviceData;

  autoconnect: boolean = false;

  autoconnectHandler: ?AutoconnectHandlerFunc;

  autoconnectDevicePool: RemoteDeviceData[];

  autoconnectCurrentDeviceIdx: number = -1;

  constructor(settings?: DeviceConnectorSettings) {
    if (settings) {
      const { autoconnect, autoconnectHandler } = settings;
      if (autoconnect && autoconnectHandler) {
        this.autoconnect = autoconnect;
        this.autoconnectHandler = autoconnectHandler;
        this.autoconnectDevicePool =
          PersistenceService.read(DEVICE_HISTORY_PERSISTENCE_KEY) || [];
      }
    }
  }

  setConnected(device: ?RemoteDeviceData) {
    this.device = device;
  }

  tryAutoconnect(device: RemoteDeviceData) {
    if (this.autoconnect && !this.isConnected() && device.online) {
      const doAutoconnect = () => {
        this.setConnected(device);
        if (this.autoconnectHandler) {
          this.autoconnectHandler(new RemoteDevice(device));
        }
      };
      if (this.autoconnectDevicePool.length === 0) {
        doAutoconnect();
      } else {
        const idx = this.autoconnectDevicePool.findIndex(
          saved => genId(saved) === genId(device),
        );
        if (
          idx !== -1 &&
          (idx < this.autoconnectCurrentDeviceIdx ||
            this.autoconnectCurrentDeviceIdx === -1)
        ) {
          this.autoconnectCurrentDeviceIdx = idx;
        }

        if (
          (idx === -1 && this.autoconnectCurrentDeviceIdx === -1) ||
          (idx !== -1 &&
            this.autoconnectCurrentDeviceIdx !== -1 &&
            idx <= this.autoconnectCurrentDeviceIdx)
        ) {
          if (idx === 0) {
            doAutoconnect();
          } else {
            debounce(doAutoconnect, AUTOCONNECT_MAX_WAIT_MILLIS)();
          }
        }
      }
    }
  }

  isConnected() {
    return this.device ? this.device.online : false;
  }

  connect(device: RemoteDeviceData) {
    const id = genId(device);
    const stored = this.devices.get(id);
    if (stored && stored.online) {
      this.setConnected(device);
      this.autoconnectDevicePool.unshift(device);
      PersistenceService.write(
        DEVICE_HISTORY_PERSISTENCE_KEY,
        this.autoconnectDevicePool,
      );
    }
  }

  disconnect() {
    this.setConnected(null);
  }

  update(device: RemoteDeviceData) {
    const id = genId(device);
    const stored = this.devices.get(id);
    if (stored) {
      stored.online = device.online;
    } else {
      this.devices.set(id, device);
    }
    this.tryAutoconnect(device);
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
