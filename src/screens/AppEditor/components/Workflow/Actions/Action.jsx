// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import { IconButton } from '../../../../../components/InputFields/Button';

import PersistenceService from '../../../../../services/persistence';

import './Action.scss';

export const ActionMode = Object.freeze({
  SUMMARY: Symbol('summary'),
  EDIT: Symbol('edit'),
});

export type ActionContentProps = {
  id: string,
  mode: Symbol,
  formik: {
    values: any,
    setFieldValue: (string, any) => void,
  },
};

type ActionProps = {
  id: string,
  actionName: string,
  initMode: Symbol,
};

type ActionHeaderProps = {
  actionName: string,
  showButtons: boolean,
  mode: Symbol,
  onSave: () => void,
  onDiscard: () => void,
  onDelete: () => void,
};

const ActionHeader = (props: ActionHeaderProps) => {
  const { actionName, showButtons, mode, onSave, onDiscard, onDelete } = props;
  return (
    <div className="ActionContainer__header">
      <div className="ActionContainer__header__buffer" />
      <div className="ActionContainer__header__title">
        <span>{actionName}</span>
      </div>
      {showButtons && mode === ActionMode.EDIT ? (
        <div className="ActionContainer__header__buttons">
          <IconButton
            iconClassName="ActionContainer__header__buttons__trashIcon"
            onClick={onDelete}
          >
            <FaTrashAlt />
          </IconButton>
          <IconButton onClick={onSave}>
            <FaSave />
          </IconButton>
          <IconButton onClick={onDiscard}>
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
  initialValues: any,
) => {
  const comp = (props: ActionProps) => {
    const { id, actionName, initMode } = props;
    const [onFocus, setOnFocus] = React.useState(false);
    const [mode, setMode] = React.useState(initMode);
    return (
      <Formik initialValues={initialValues}>
        {formik => (
          <div
            className="ActionContainer"
            onMouseEnter={() => setOnFocus(true)}
            onMouseLeave={() => setOnFocus(false)}
          >
            {mode === ActionMode.SUMMARY ? null : (
              <ActionHeader
                actionName={actionName}
                showButtons={onFocus}
                onSave={() => {
                  if (mode === ActionMode.EDIT) {
                    setMode(ActionMode.SUMMARY);
                    PersistenceService.write('Actions', {
                      [id]: formik.values,
                    });
                  }
                }}
                onDiscard={() => {
                  if (mode === ActionMode.EDIT) {
                    setMode(ActionMode.SUMMARY);
                    formik.resetForm(PersistenceService.read('Actions', id));
                  }
                }}
                onDelete={() => {}}
                mode={mode}
                onModeChange={newMode => setMode(newMode)}
              />
            )}
            <div className="ActionContainer__content">
              <div className="ActionContainer__content__frame">
                <ActionComponent id={id} mode={mode} formik={formik} />
              </div>
              {mode === ActionMode.SUMMARY ? (
                <IconButton
                  className="ActionContainer__content__summary__edit"
                  iconClassName="ActionContainer__content__summary__editIcon"
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
        )}
      </Formik>
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
  mode: PropTypes.symbol.isRequired,
  onSave: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withAction;
