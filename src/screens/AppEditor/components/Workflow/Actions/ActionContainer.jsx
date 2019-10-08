// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';

import { IconButton } from '../../../../../components/InputFields/Button';

import './ActionContainer.scss';

type ActionContainerProps = {
  actionName: string,
  children?: React.Node,
};

type ActionContainerHeaderProps = {
  actionName: string,
  showButtons: boolean,
};

const ActionContainerHeader = (props: ActionContainerHeaderProps) => {
  const { actionName, showButtons } = props;
  return (
    <div className="ActionContainer__header">
      <div className="ActionContainer__header__buffer" />
      <div className="ActionContainer__header__title">
        <span>{actionName}</span>
      </div>
      {showButtons ? (
        <div className="ActionContainer__header__buttons">
          <IconButton>
            <FaSave />
          </IconButton>
          <IconButton>
            <FaEdit />
          </IconButton>
          <IconButton iconClassName="ActionContainer__header__buttons__trashIcon">
            <FaTrashAlt />
          </IconButton>
        </div>
      ) : (
        <div className="ActionContainer__header__buffer" />
      )}
    </div>
  );
};

const ActionContainer = (props: ActionContainerProps) => {
  const { actionName, children } = props;
  const [onFocus, setOnFocus] = React.useState(false);
  return (
    <div
      className="ActionContainer"
      onMouseEnter={() => setOnFocus(true)}
      onMouseLeave={() => setOnFocus(false)}
    >
      <ActionContainerHeader actionName={actionName} showButtons={onFocus} />
      <div className="ActionContainer__content">{children}</div>
    </div>
  );
};

ActionContainerHeader.propTypes = {
  actionName: PropTypes.string.isRequired,
  showButtons: PropTypes.bool.isRequired,
};

ActionContainer.propTypes = {
  actionName: PropTypes.string,
  children: PropTypes.node,
};

ActionContainer.defaultProps = {
  actionName: 'Inline',
  children: null,
};

export default ActionContainer;
