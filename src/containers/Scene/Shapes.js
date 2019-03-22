import PropTypes from 'prop-types';

const lazyPropType = f => (...args) => f().apply(this, args);

const UITreeShape = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onFocus: PropTypes.bool.isRequired,
  isHidden: PropTypes.bool.isRequired,
  imgUrl: PropTypes.string.isRequired,
  depthMap: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }),
    ),
  ),
  children: PropTypes.arrayOf(lazyPropType(() => UITreeShape)),
});

const ConstraintIndicatorShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  lineGroup: PropTypes.arrayOf(
    PropTypes.shape({
      x1: PropTypes.number.isRequired,
      y1: PropTypes.number.isRequired,
      z1: PropTypes.number.isRequired,
      x2: PropTypes.number.isRequired,
      y2: PropTypes.number.isRequired,
      z2: PropTypes.number.isRequired,
    }),
  ),
});

export { UITreeShape, ConstraintIndicatorShape };
