// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';

import './ActionContainer.scss';

type ActionContainerProps = {
  children?: React.Node,
};

const ActionContainer = (props: ActionContainerProps) => {
  const { children } = props;
  return (
    <div className="ActionContainer">
      {children}
      <FaSave />
      <FaEdit />
      <FaTrashAlt />
    </div>
  );
};

ActionContainer.propTypes = {
  children: PropTypes.node,
};

ActionContainer.defaultProps = {
  children: null,
};

export default ActionContainer;
