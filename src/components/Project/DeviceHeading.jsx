// @flow
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { IconContext } from 'react-icons';
import { FaMobileAlt, FaCaretDown, FaCaretRight } from 'react-icons/fa';

import './DeviceHeading.scss';

const PROJECT_STATUS_CONNECTED = ' (connected)';

type DeviceHeadingProps = {
  expanded: boolean,
  projectName: string,
  connected: boolean,
  onlineCount: number,
  offlineCount: number,
};

const DeviceHeading = ({
  expanded,
  projectName,
  connected,
  onlineCount,
  offlineCount,
}: DeviceHeadingProps) => {
  return (
    <div
      className={cx('DeviceHeading', {
        expanded,
      })}
    >
      <IconContext.Provider value={{ className: 'DeviceHeading__caret' }}>
        {expanded ? <FaCaretDown /> : <FaCaretRight />}
      </IconContext.Provider>
      <span className="DeviceHeading__projectDescription">
        <span className="DeviceHeading__projectDescription__name">
          {projectName}
        </span>
        {connected ? (
          <span className="DeviceHeading__projectDescription__status">
            {PROJECT_STATUS_CONNECTED}
          </span>
        ) : null}
      </span>
      <span className="DeviceHeading__status online">
        <FaMobileAlt />
        {`(${onlineCount})`}
      </span>
      <span className="DeviceHeading__status offline">
        <FaMobileAlt />
        {`(${offlineCount})`}
      </span>
    </div>
  );
};

DeviceHeading.propTypes = {
  expanded: PropTypes.bool,
  connected: PropTypes.bool,
  projectName: PropTypes.string.isRequired,
  onlineCount: PropTypes.number,
  offlineCount: PropTypes.number,
};

DeviceHeading.defaultProps = {
  expanded: false,
  connected: false,
  onlineCount: 0,
  offlineCount: 0,
};

export default DeviceHeading;
