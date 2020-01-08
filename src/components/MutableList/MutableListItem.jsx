// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import { IconButton } from '../InputFields/Button';

import { readItem, writeItem } from './operations';
import Persistence, { setForm } from '../../screens/AppEditor/form/Presistence';

import type { MutableListItemModeType } from './types';
import { MutableListItemMode } from './enums';

import './MutableListItem.scss';

type MutableListItemProps = {
  id: string,
  mode: MutableListItemModeType,
  formik: any,
  autosave: boolean,
  // $FlowFixMe missing type def in flow-typed
  children: (formik: any, mode: MutableListItemModeType) => React.Element<any>,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type HeaderProps = {
  name: string,
  mode: MutableListItemModeType,
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
      {mode === MutableListItemMode.EDIT ? (
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
      {mode === MutableListItemMode.EDIT ? (
        <Header
          name=""
          mode={mode}
          onSave={() => {
            formik.validateForm().then(errors => {
              if (!hasErrors(errors) && mode === MutableListItemMode.EDIT) {
                setMode(MutableListItemMode.SUMMARY);
                writeItem(id, formik);
                onSave(id);
              }
            });
          }}
          onDiscard={() => {
            const persisted = readItem(id);
            if (!persisted) {
              onDelete(id);
            } else if (mode === MutableListItemMode.EDIT) {
              setMode(MutableListItemMode.SUMMARY);
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
        {mode === MutableListItemMode.SUMMARY ? (
          <IconButton
            className="MutableListItem__content__summary__edit"
            iconClassName="MutableListItem__content__summary__editIcon"
            onClick={() => {
              if (mode === MutableListItemMode.SUMMARY) {
                setMode(MutableListItemMode.EDIT);
              }
            }}
          >
            <FaEdit />
          </IconButton>
        ) : null}
      </div>
      <Persistence name={id} formik={formik} autosave={autosave} />
    </div>
  );
};

MutableListItem.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.string,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

MutableListItem.defaultProps = {
  mode: MutableListItemMode.SUMMARY,
  onDelete: () => {},
  onSave: () => {},
};

export default MutableListItem;
