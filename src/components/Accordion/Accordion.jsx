// @flow
import React from 'react';
import PropTypes from 'prop-types';

type AccordionProps = {
  children: any,
};

const Accordion = ({ children }: AccordionProps) => (
  <div className="Accordion">{children}</div>
);

Accordion.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Accordion;
