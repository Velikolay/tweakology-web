import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { IconContext } from 'react-icons';

import './TabBar.scss';

class TabBar extends Component {
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
    const { children, light } = this.props;
    const ids = React.Children.map(children, tab => tab.props.id);
    const defaultId = ids.length > 0 ? ids[0] : null;
    const tabs = children.map(({ props: { id, title } }) => (
      <button
        className={cx('TabBar__tab', {
          'is-active': this.isActive(id, defaultId),
          light,
        })}
        key={id}
        type="button"
        onClick={() => this.setState({ activeTab: id })}
      >
        <IconContext.Provider
          value={{
            className: cx('TabBar__tab__icon', {
              'is-active': this.isActive(id, defaultId),
            }),
          }}
        >
          {title}
        </IconContext.Provider>
      </button>
    ));

    const content = React.Children.map(children, tab =>
      React.cloneElement(tab, {
        isActive: this.isActive(tab.props.id, defaultId),
      }),
    );
    return (
      <div className="TabBar">
        <div className="TabBar__tabs">{tabs}</div>
        {content}
      </div>
    );
  }
}

TabBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  light: PropTypes.bool.isRequired,
};

export default TabBar;
