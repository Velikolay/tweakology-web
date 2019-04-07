import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './TabMenu.scss';

class TabMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: null,
    };
  }

  isActive(tabName, defaultTab) {
    const { activeTab } = this.state;
    return (activeTab || defaultTab) === tabName;
  }

  render() {
    const { children } = this.props;
    const tabNames = React.Children.map(children, tab => tab.props.name);
    const defaultTab = tabNames.length > 0 ? tabNames[0] : null;
    const tabs = tabNames.map(name => (
      <button
        className={cx('TabMenu__tab', {
          'is-active': this.isActive(name, defaultTab),
        })}
        type="button"
        onClick={() => this.setState({ activeTab: name })}
      >
        {this.isActive(name, defaultTab) ? (
          <div className="TabMenu__tab__highlight" />
        ) : null}
        {name}
      </button>
    ));

    const content = React.Children.map(children, tab =>
      React.cloneElement(tab, {
        isActive: this.isActive(tab.props.name, defaultTab),
      }),
    );
    return (
      <div className="TabMenu">
        <div className="TabMenu__tabs">{tabs}</div>
        {content}
      </div>
    );
  }
}

TabMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default TabMenu;
