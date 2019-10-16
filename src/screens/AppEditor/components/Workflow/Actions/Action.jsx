// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

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
  return (
    <div className="ActionContainer__header">
      <div className="ActionContainer__header__buffer" />
      <div className="ActionContainer__header__title">
        <span>{actionName}</span>
      </div>
      {showButtons && mode === ActionMode.EDIT ? (
        <div className="ActionContainer__header__buttons">
          <IconButton iconClassName="ActionContainer__header__buttons__trashIcon">
            <FaTrashAlt />
          </IconButton>
          <IconButton
            onClick={() => {
              if (mode === ActionMode.EDIT) {
                onModeChange(ActionMode.SUMMARY);
              }
            }}
          >
            <FaSave />
          </IconButton>
          <IconButton
            onClick={() => {
              if (mode === ActionMode.EDIT) {
                onModeChange(ActionMode.SUMMARY);
              }
            }}
          >
            <FaTimes />
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
        {mode === ActionMode.SUMMARY ? null : (
          <ActionHeader
            actionName={actionName}
            showButtons={onFocus}
            mode={mode}
            onModeChange={newMode => setMode(newMode)}
          />
        )}
        <div className="ActionContainer__content">
          <div className="ActionContainer__content__frame">
            <ActionComponent id={id} mode={mode} />
          </div>
          {mode === ActionMode.SUMMARY ? (
            <IconButton
              className="ActionContainer__content__summary__expand"
              iconClassName="ActionContainer__content__summary__expandIcon"
              onClick={() => {
                if (mode === ActionMode.SUMMARY) {
                  setMode(ActionMode.EDIT);
                }
              }}
            >
              <FaEdit />
            </IconButton>
          ) : null}
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
    actionName: '',
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
