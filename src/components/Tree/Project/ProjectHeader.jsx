// @flow
import React from 'react';
import cx from 'classnames';
import { FaProjectDiagram, FaMobileAlt, FaFolder } from 'react-icons/fa';
import { IconContext } from 'react-icons';

import type { RemoteDeviceData } from '../../../services/device/connector';
import { DeviceShape } from './Shapes';

import './ProjectHeader.scss';

type ProjectHeaderProps = {
  device: RemoteDeviceData,
};

const ProjectHeader = ({
  device: { name, host, port, online },
}: ProjectHeaderProps) => (
  <div className="ProjectHeader">
    {/* <span
      className={cx('ProjectHeader__deviceStatus', {
        online,
      })}
    />
    <span className="ProjectHeader__projectDetails">
      <div className="ProjectHeader__projectDetails__text">{host}</div>
      <div className="ProjectHeader__projectDetails__text">{`${name}: AmazingTestFeature_B`}</div>
    </span> */}
    <span className="ProjectHeader__tabs">
      <IconContext.Provider value={{ className: 'ProjectHeader__tabs__icon' }}>
        <FaProjectDiagram />
        <FaMobileAlt />
        <FaFolder />
      </IconContext.Provider>
    </span>
  </div>
);

ProjectHeader.propTypes = {
  device: DeviceShape.isRequired,
};

export default ProjectHeader;
