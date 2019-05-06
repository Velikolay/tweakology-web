// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash.isequal';

import Accordion, { AccordionItem } from '../Accordion';

import Device from '../../components/Project/Device';
import DeviceList from '../../components/Project/DeviceList';
import DeviceHeading from '../../components/Project/DeviceHeading';
import { DevicesShape, DeviceShape } from '../../components/Project/Shapes';

const genId = ({ name, host, port }) => `${name}:${host}:${port}`;

type DeviceType = {
  name: string,
  host: string,
  port: number,
  online: boolean,
};

type DeviceSelectorProps = {
  devices: DeviceType[],
  connectedDevice: ?DeviceType,
  eventHandler: (event: string, device: DeviceType) => void,
};

const DeviceSelector = ({
  devices,
  connectedDevice,
  eventHandler,
}: DeviceSelectorProps) => {
  const [onFocusDevice, setOnFocusDevice] = useState(null);
  const devicesByProject = devices.reduce((res, device) => {
    const projDevices = res.get(device.name);
    if (projDevices) {
      projDevices.push(device);
    } else {
      res.set(device.name, [device]);
    }
    return res;
  }, new Map());
  devicesByProject.forEach(value =>
    value.sort((a, b) => {
      if (a.online === b.online) {
        return genId(a).localeCompare(genId(b));
      }
      return a.online ? -1 : 1;
    }),
  );
  const accordionItems = Array.from(devicesByProject.entries()).map(
    ([projectName, projectDevices], idx) => {
      const onlineCnt = projectDevices.reduce(
        (acc, { online }) => (online ? acc + 1 : acc),
        0,
      );
      const offlineCnt = projectDevices.reduce(
        (acc, { online }) => (!online ? acc + 1 : acc),
        0,
      );
      const projectConnected = projectDevices.some(device =>
        isEqual(connectedDevice, device),
      );
      const expanded = projectConnected || (!connectedDevice && idx === 0);
      return (
        <AccordionItem
          key={projectName}
          heading={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <DeviceHeading
              projectName={projectName}
              connected={projectConnected}
              onlineCount={onlineCnt}
              offlineCount={offlineCnt}
            />
          }
          expanded={expanded}
        >
          <DeviceList>
            {projectDevices.map(device => (
              <Device
                key={genId(device)}
                device={device}
                connected={isEqual(connectedDevice, device)}
                onFocus={isEqual(onFocusDevice, device)}
                eventHandler={(event: string, obj: DeviceType) => {
                  if (event === 'hoveron') {
                    setOnFocusDevice(obj);
                  } else if (event === 'hoveroff') {
                    setOnFocusDevice(null);
                  } else if (event === 'connect') {
                    eventHandler(event, obj);
                  } else if (event === 'disconnect') {
                    eventHandler(event, obj);
                  }
                }}
              />
            ))}
          </DeviceList>
        </AccordionItem>
      );
    },
  );
  return <Accordion>{accordionItems}</Accordion>;
};

DeviceSelector.defaultProps = {
  connectedDevice: null,
  devices: [],
};

DeviceSelector.propTypes = {
  devices: DevicesShape,
  connectedDevice: DeviceShape,
  eventHandler: PropTypes.func.isRequired,
};

export default DeviceSelector;
