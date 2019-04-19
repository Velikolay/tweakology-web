import PropTypes from 'prop-types';

const Tab = ({ isActive, children }) => (isActive ? children : null);

Tab.propTypes = {
  id: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Tab;
