// @flow
import React from 'react';
import cx from 'classnames';

import type { RemoteDeviceData } from '../../../services/device/connector';
import { DeviceShape, DevicesShape } from './Shapes';

import './DeviceMenu.scss';

type DeviceMenuProps = {
  devices: RemoteDeviceData[],
};

const DeviceDetails = ({ name, host, port, online }: RemoteDeviceData) => (
  <div className="DeviceDetails">
    <span
      className={cx('DeviceDetails__status', {
        online,
      })}
    />
    <span className="DeviceDetails__identifier">{`${name}: ${host}`}</span>
  </div>
);

const generateKey = ({ name, host, port }: RemoteDeviceData) =>
  `${name}-${host}-${port}`;

const DeviceMenu = ({ devices }: DeviceMenuProps) => (
  <React.Fragment>
    {devices.map(device => (
      <DeviceDetails key={generateKey(device)} {...device} />
    ))}
  </React.Fragment>
);

DeviceDetails.propTypes = DeviceShape;

DeviceMenu.propTypes = {
  devices: DevicesShape.isRequired,
};

export default DeviceMenu;
