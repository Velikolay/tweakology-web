// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './AccordionItem.scss';

type AccordionItemProps = {
  expanded: boolean,
  heading: any,
  children: any,
};

const AccordionItem = (props: AccordionItemProps) => {
  const { heading, children, expanded: initialExpanded } = props;
  const [expanded, setExpanded] = useState(initialExpanded);
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
        onClick={() => setExpanded(!expanded)}
      >
        {expandableHeading}
      </button>
      {expanded ? children : null}
    </div>
  );
};

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
