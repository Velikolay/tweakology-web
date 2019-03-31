import SceneTreeReducer from './tree';
import SceneConstraintReducer from './constraint';

export default {
  mapStateToProps: state => {
    const { tree, activeNode, onFocusNode, ...other } = state;
    const props = {
      tree: SceneTreeReducer.mapStateToProps(state),
      ...other,
    };
    if (activeNode && activeNode.type === 'NSLayoutConstraint') {
      props.constraints = [
        SceneConstraintReducer.mapStateToProps({
          tree: props.tree,
          activeNode,
        }),
      ];
    }
    return props;
  },
};
