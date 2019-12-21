import PropTypes from 'prop-types';

const lazyPropType = f => (...args) => f().apply(this, args);

let TreeConstraintParentNodeShape;
let TreeConstraintNodeShape;

const TreeInitialNodeShape = PropTypes.shape({
  module: PropTypes.string.isRequired,
  leaf: PropTypes.bool.isRequired,
});

const TreeViewNodeShape = PropTypes.shape({
  module: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  revision: PropTypes.number.isRequired,
  properties: PropTypes.object.isRequired,
  threeD: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  collapsed: PropTypes.bool,
  leaf: PropTypes.bool,
  superview: lazyPropType(() => TreeViewNodeShape),
  children: PropTypes.arrayOf(
    lazyPropType(() =>
      PropTypes.oneOfType([TreeViewNodeShape, TreeConstraintParentNodeShape]),
    ),
  ),
});

TreeConstraintParentNodeShape = PropTypes.shape({
  module: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  superview: lazyPropType(() => TreeViewNodeShape).isRequired,
  children: PropTypes.arrayOf(lazyPropType(() => TreeConstraintNodeShape))
    .isRequired,
});

TreeConstraintNodeShape = PropTypes.shape({
  module: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  properties: PropTypes.object.isRequired,
  leaf: PropTypes.bool.isRequired,
  superview: lazyPropType(() => TreeConstraintParentNodeShape).isRequired,
});

const TreeNodeShape = PropTypes.oneOfType([
  TreeInitialNodeShape,
  TreeViewNodeShape,
  TreeConstraintParentNodeShape,
  TreeConstraintNodeShape,
]);

const TreeRootNodeShape = PropTypes.oneOfType([
  TreeInitialNodeShape,
  TreeViewNodeShape,
]);

export { TreeRootNodeShape, TreeNodeShape, TreeViewNodeShape };
