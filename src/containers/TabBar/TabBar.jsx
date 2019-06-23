import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { IconContext } from 'react-icons';

import './TabBar.scss';

const TabBar = props => {
  const [activeTab, setActiveTab] = useState(null);

  const isActive = (tabName, defaultTab) =>
    (activeTab || defaultTab) === tabName;

  const { children, light } = props;
  const ids = React.Children.map(children, tab => tab.props.id);
  const defaultId = ids.length > 0 ? ids[0] : null;
  const tabs = children.map(({ props: { id, title } }) => (
    <button
      className={cx('TabBar__tab', {
        'is-active': isActive(id, defaultId),
        light,
      })}
      key={id}
      type="button"
      onClick={() => setActiveTab(id)}
    >
      <IconContext.Provider
        value={{
          className: cx('TabBar__tab__icon', {
            'is-active': isActive(id, defaultId),
          }),
        }}
      >
        {title}
      </IconContext.Provider>
    </button>
  ));

  const content = React.Children.map(children, tab =>
    React.cloneElement(tab, {
      isActive: isActive(tab.props.id, defaultId),
    }),
  );
  return (
    <div className="TabBar">
      <div className="TabBar__tabs">{tabs}</div>
      {content}
    </div>
  );
};

TabBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  light: PropTypes.bool,
};

TabBar.defaultProps = {
  light: false,
};

export default TabBar;
