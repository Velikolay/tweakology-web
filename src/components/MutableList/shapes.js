import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const MutableListItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  kind: PropTypes.string,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
});
