// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { IconContext } from 'react-icons';
import { FaPlug } from 'react-icons/fa';

import './DeviceItem.scss';

type DeviceType = {
  name: string,
  host: string,
  port: number,
  online: boolean,
};

type handlerFunc = (event: string, device: DeviceType) => void;

type DeviceItemProps = {
  device: DeviceType,
  connected: boolean,
  onFocus: boolean,
  eventHandler: handlerFunc,
};

const genName = ({ host, port }: DeviceType) => `${host}:${port}`;

const DeviceItem = ({
  device,
  connected,
  onFocus,
  eventHandler,
}: DeviceItemProps) => (
  <div
    className={cx('Device', {
      onFocus,
      connected,
    })}
    onMouseEnter={() => eventHandler('hoveron', device)}
    onMouseLeave={() => eventHandler('hoveroff', device)}
  >
    <IconContext.Provider
      value={{
        className: cx('Device__status', {
          online: device.online,
        }),
      }}
    >
      <FaPlug />
    </IconContext.Provider>
    <span className="Device__name">{genName(device)}</span>
    {connected ? (
      <button
        className="Device__connectButton"
        type="button"
        onClick={() => eventHandler('disconnect', device)}
      >
        disconnect
      </button>
    ) : null}
    {!connected && device.online && onFocus ? (
      <button
        className="Device__connectButton"
        type="button"
        onClick={() => eventHandler('connect', device)}
      >
        connect
      </button>
    ) : null}
  </div>
);

DeviceItem.propTypes = {
  device: PropTypes.shape({
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
  }).isRequired,
  connected: PropTypes.bool,
  onFocus: PropTypes.bool,
  eventHandler: PropTypes.func.isRequired,
};

DeviceItem.defaultProps = {
  connected: false,
  onFocus: false,
};

export default DeviceItem;
