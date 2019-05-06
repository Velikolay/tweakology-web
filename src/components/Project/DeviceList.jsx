// @flow
import React from 'react';
import PropTypes from 'prop-types';

import './DeviceList.scss';

type DeviceListProps = {
  children: any,
};

const DeviceList = ({ children }: DeviceListProps) => (
  <div className="DeviceList">{children}</div>
);

DeviceList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

DeviceList.defaultProps = {
  children: null,
};

export default DeviceList;
