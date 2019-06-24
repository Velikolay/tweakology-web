import PropTypes from 'prop-types';

export const DeviceShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  port: PropTypes.number.isRequired,
  online: PropTypes.bool.isRequired,
});

export const DevicesShape = PropTypes.arrayOf(DeviceShape);
