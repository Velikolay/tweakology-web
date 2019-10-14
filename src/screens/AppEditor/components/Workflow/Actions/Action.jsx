// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';

import { IconButton } from '../../../../../components/InputFields/Button';

import './Action.scss';

export const ActionMode = Object.freeze({
  SUMMARY: Symbol('summary'),
  EXPANDED: Symbol('expanded'),
  EDIT: Symbol('edit'),
});

export type ActionContentProps = {
  id: string,
  mode: Symbol,
};

type ActionProps = {
  id: string,
  actionName: string,
  initMode: Symbol,
};

type ActionHeaderProps = {
  actionName: string,
  mode: Symbol,
  onModeChange: Symbol => void,
  showButtons: boolean,
};

const ActionHeader = (props: ActionHeaderProps) => {
  const { actionName, mode, onModeChange, showButtons } = props;
  const saveDisabled =
    mode === ActionMode.SUMMARY || mode === ActionMode.EXPANDED;

  const editDisabled = mode === ActionMode.EDIT;

  return (
    <div className="ActionContainer__header">
      <div className="ActionContainer__header__buffer" />
      <div className="ActionContainer__header__title">
        <span>{actionName}</span>
      </div>
      {showButtons ? (
        <div className="ActionContainer__header__buttons">
          <IconButton
            disabled={saveDisabled}
            onClick={() => {
              if (mode === ActionMode.EDIT) {
                onModeChange(ActionMode.SUMMARY);
              }
            }}
          >
            <FaSave />
          </IconButton>
          <IconButton
            disabled={editDisabled}
            onClick={() => {
              if (mode !== ActionMode.EDIT) {
                onModeChange(ActionMode.EDIT);
              }
            }}
          >
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

const withAction = (
  ActionComponent: React.AbstractComponent<ActionContentProps>,
) => {
  const comp = (props: ActionProps) => {
    const { id, actionName, initMode } = props;
    const [onFocus, setOnFocus] = React.useState(false);
    const [mode, setMode] = React.useState(initMode);
    return (
      <div
        className="ActionContainer"
        onMouseEnter={() => setOnFocus(true)}
        onMouseLeave={() => setOnFocus(false)}
      >
        <ActionHeader
          actionName={actionName}
          showButtons={onFocus}
          mode={mode}
          onModeChange={newMode => setMode(newMode)}
        />
        <div className="ActionContainer__content">
          <ActionComponent id={id} mode={mode} />
        </div>
      </div>
    );
  };
  comp.propTypes = {
    id: PropTypes.string.isRequired,
    actionName: PropTypes.string,
    initMode: PropTypes.symbol,
  };

  comp.defaultProps = {
    actionName: 'Inline',
    initMode: ActionMode.SUMMARY,
  };
  return comp;
};

ActionHeader.propTypes = {
  actionName: PropTypes.string.isRequired,
  showButtons: PropTypes.bool.isRequired,
  onModeChange: PropTypes.func.isRequired,
};

export default withAction;
