// @flow
import type { AbstractComponent } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import { IconButton } from '../../../../../components/InputFields/Button';

import PersistenceService from '../../../../../services/persistence';
import Persistence, { setForm } from '../../../form/Presistence';

import './ActionHOC.scss';

export const ActionMode = Object.freeze({
  SUMMARY: Symbol('summary'),
  EDIT: Symbol('edit'),
});

export type ActionContentProps = {
  id: string,
  mode: Symbol,
  formik: {
    values: any,
    errors: any,
    setFieldValue: (string, any) => void,
  },
};

type ActionHeaderProps = {
  actionName: string,
  mode: Symbol,
  onSave: () => void,
  onDiscard: () => void,
  onDelete: () => void,
};

const ActionHeader = (props: ActionHeaderProps) => {
  const { actionName, mode, onSave, onDiscard, onDelete } = props;
  return (
    <div className="ActionContainer__header">
      <div className="ActionContainer__header__buffer" />
      <div className="ActionContainer__header__title">
        <span>{actionName}</span>
      </div>
      {mode === ActionMode.EDIT ? (
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

ActionHeader.propTypes = {
  actionName: PropTypes.string.isRequired,
  mode: PropTypes.symbol.isRequired,
  onSave: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

type ActionProps = {
  id: string,
  actionName: string,
  initMode: Symbol,
  initValues?: any,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

const hasErrors = errors =>
  Object.keys(errors).length !== 0 || errors.constructor !== Object;

const withAction = (
  ActionComponent: AbstractComponent<ActionContentProps>,
  validationSchema: Yup.Schema<any, any>,
  defaultInitValues: any,
) => {
  const comp = (props: ActionProps) => {
    const {
      id,
      actionName,
      initMode,
      initValues: customInitValues,
      onSave,
      onDelete,
    } = props;
    const initValues = customInitValues || defaultInitValues;
    const persistKey = `Actions.${id}`;
    const [mode, setMode] = useState(initMode);
    return (
      <Formik initialValues={initValues} validationSchema={validationSchema}>
        {formik => (
          <div className="ActionContainer">
            {mode === ActionMode.SUMMARY ? null : (
              <ActionHeader
                actionName={actionName}
                mode={mode}
                onSave={() => {
                  formik.validateForm().then(errors => {
                    if (!hasErrors(errors) && mode === ActionMode.EDIT) {
                      setMode(ActionMode.SUMMARY);
                      PersistenceService.write(persistKey, formik);
                      onSave(id);
                    }
                  });
                }}
                onDiscard={() => {
                  const persisted = PersistenceService.read(persistKey);
                  if (!persisted) {
                    onDelete(id);
                  } else if (mode === ActionMode.EDIT) {
                    setMode(ActionMode.SUMMARY);
                    setForm(formik, persisted);
                  }
                }}
                onDelete={() => onDelete(id)}
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
            <Persistence name={persistKey} formik={formik} autosave={false} />
          </div>
        )}
      </Formik>
    );
  };
  comp.propTypes = {
    id: PropTypes.string.isRequired,
    actionName: PropTypes.string,
    initMode: PropTypes.symbol,
    initValues: PropTypes.any,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
  };

  comp.defaultProps = {
    actionName: '',
    initMode: ActionMode.SUMMARY,
    initValues: null,
    onDelete: () => {},
    onSave: () => {},
  };
  return comp;
};

export default withAction;
