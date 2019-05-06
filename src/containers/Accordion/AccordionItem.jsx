// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './AccordionItem.scss';

type AccordionItemProps = {
  expanded: boolean,
  heading: any,
  children: any,
};

type AccordionItemState = {
  expanded: boolean,
};

class AccordionItem extends Component<AccordionItemProps, AccordionItemState> {
  static defaultProps: {
    expanded: boolean,
  };

  constructor(props: AccordionItemProps) {
    super(props);
    this.state = {
      expanded: props.expanded,
    };
  }

  render() {
    const { heading, children } = this.props;
    const { expanded } = this.state;
    const expandableHeading = React.cloneElement(heading, { expanded });
    return (
      <div
        className={cx('AccordionItem', {
          expanded,
        })}
      >
        <button
          type="button"
          className="AccordionItem__heading"
          onClick={() => this.setState({ expanded: !expanded })}
        >
          {expandableHeading}
        </button>
        {expanded ? children : null}
      </div>
    );
  }
}

AccordionItem.defaultProps = {
  expanded: false,
  children: null,
};

AccordionItem.propTypes = {
  heading: PropTypes.node.isRequired,
  children: PropTypes.node,
  expanded: PropTypes.bool,
};

export default AccordionItem;
