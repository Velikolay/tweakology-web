import PropTypes from 'prop-types';

const lazyPropType = f => (...args) => f().apply(this, args);

const SceneTreeShape = PropTypes.shape({
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
  children: PropTypes.arrayOf(lazyPropType(() => SceneTreeShape)),
});

const PointShape = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
});

const LineShape = PropTypes.shape({
  p1: PointShape.isRequired,
  p2: PointShape.isRequired,
});

const SceneConstraintShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  lines: PropTypes.arrayOf(LineShape).isRequired,
});

export { SceneTreeShape, SceneConstraintShape };
