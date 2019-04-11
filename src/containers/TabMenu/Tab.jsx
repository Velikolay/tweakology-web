import PropTypes from 'prop-types';

const Tab = ({ isActive, children }) => (isActive ? children : null);

Tab.propTypes = {
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Tab;
