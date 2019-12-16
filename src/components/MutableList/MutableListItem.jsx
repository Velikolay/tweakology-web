// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import { IconButton } from '../InputFields/Button';

import PersistenceService from '../../services/persistence';
import Persistence, { setForm } from '../../screens/AppEditor/form/Presistence';

import './MutableListItem.scss';

export const Mode = Object.freeze({
  SUMMARY: Symbol('summary'),
  EDIT: Symbol('edit'),
});

type MutableListItemProps = {
  id: string,
  persistKey: string,
  mode: Symbol,
  formik: any,
  autosave: boolean,
  children: any,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type HeaderProps = {
  name: string,
  mode: Symbol,
  onSave: () => void,
  onDiscard: () => void,
  onDelete: () => void,
};

const Header = (props: HeaderProps) => {
  const { name, mode, onSave, onDiscard, onDelete } = props;
  return (
    <div className="MutableListItem__header">
      <div className="MutableListItem__header__buffer" />
      <div className="MutableListItem__header__title">
        <span>{name}</span>
      </div>
      {mode === Mode.EDIT ? (
        <div className="MutableListItem__header__buttons">
          <IconButton
            iconClassName="MutableListItem__header__buttons__trashIcon"
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
        <div className="MutableListItem__header__buffer" />
      )}
    </div>
  );
};

const hasErrors = errors =>
  Object.keys(errors).length !== 0 || errors.constructor !== Object;

const MutableListItem = (props: MutableListItemProps) => {
  const {
    id,
    persistKey,
    mode: initMode,
    formik,
    autosave,
    children,
    onSave,
    onDelete,
  } = props;
  const [mode, setMode] = useState(initMode);
  return (
    <div className="MutableListItem">
      {mode === Mode.EDIT ? (
        <Header
          name=""
          mode={mode}
          onSave={() => {
            formik.validateForm().then(errors => {
              if (!hasErrors(errors) && mode === Mode.EDIT) {
                setMode(Mode.SUMMARY);
                PersistenceService.write(persistKey, formik);
                onSave(id);
              }
            });
          }}
          onDiscard={() => {
            const persisted = PersistenceService.read(persistKey);
            if (!persisted) {
              onDelete(id);
            } else if (mode === Mode.EDIT) {
              setMode(Mode.SUMMARY);
              setForm(formik, persisted);
            }
          }}
          onDelete={() => onDelete(id)}
        />
      ) : null}
      <div className="MutableListItem__content">
        <div className="MutableListItem__content__frame">
          {typeof children === 'function' ? children(formik, mode) : null}
        </div>
        {mode === Mode.SUMMARY ? (
          <IconButton
            className="MutableListItem__content__summary__edit"
            iconClassName="MutableListItem__content__summary__editIcon"
            onClick={() => {
              if (mode === Mode.SUMMARY) {
                setMode(Mode.EDIT);
              }
            }}
          >
            <FaEdit />
          </IconButton>
        ) : null}
      </div>
      <Persistence name={persistKey} formik={formik} autosave={autosave} />
    </div>
  );
};

MutableListItem.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.symbol,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

MutableListItem.defaultProps = {
  mode: Mode.SUMMARY,
  onDelete: () => {},
  onSave: () => {},
};

export default MutableListItem;
