// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import { IconButton } from '../InputFields/Button';

import PersistenceService from '../../services/persistence';
import Persistence, { setForm } from '../../screens/AppEditor/form/Presistence';

import './MutableListItem.scss';

export const ItemMode = Object.freeze({
  SUMMARY: Symbol('summary'),
  EDIT: Symbol('edit'),
});

export type ItemProps = {
  id: string,
  kind?: string,
  values: any,
};

export const ItemPropsShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  kind: PropTypes.string,
  values: PropTypes.objectOf(PropTypes.any).isRequired,
});

type MutableListItemProps = {
  id: string,
  mode: Symbol,
  formik: any,
  autosave: boolean,
  // $FlowFixMe missing type def in flow-typed
  children: (formik: any, mode: Symbol) => React.Element<any>,
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
      {mode === ItemMode.EDIT ? (
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
      {mode === ItemMode.EDIT ? (
        <Header
          name=""
          mode={mode}
          onSave={() => {
            formik.validateForm().then(errors => {
              if (!hasErrors(errors) && mode === ItemMode.EDIT) {
                setMode(ItemMode.SUMMARY);
                PersistenceService.write(id, formik);
                onSave(id);
              }
            });
          }}
          onDiscard={() => {
            const persisted = PersistenceService.read(id);
            if (!persisted) {
              onDelete(id);
            } else if (mode === ItemMode.EDIT) {
              setMode(ItemMode.SUMMARY);
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
        {mode === ItemMode.SUMMARY ? (
          <IconButton
            className="MutableListItem__content__summary__edit"
            iconClassName="MutableListItem__content__summary__editIcon"
            onClick={() => {
              if (mode === ItemMode.SUMMARY) {
                setMode(ItemMode.EDIT);
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
  mode: PropTypes.symbol,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

MutableListItem.defaultProps = {
  mode: ItemMode.SUMMARY,
  onDelete: () => {},
  onSave: () => {},
};

export default MutableListItem;
