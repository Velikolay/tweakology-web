// @flow
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { FaTrashAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import { IconButton } from '../../../../../components/InputFields/Button';
import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';
import type { ItemProps } from '../../../../../components/MutableList';
import MutableList, {
  ItemPropsShape,
} from '../../../../../components/MutableList';

import { NewAction, ActionItem } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';
import PersistenceService from '../../../../../services/persistence';
import Persistence, { setForm } from '../../../form/Presistence';

import './EventHandler.scss';

export const Mode = Object.freeze({
  SUMMARY: Symbol('summary'),
  EDIT: Symbol('edit'),
});

type NewEventHandlerProps = {
  id: string,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type EventHandlerItemProps = NewEventHandlerProps & {
  values: {
    events: string[],
    actions: ItemProps[],
  },
};

type EventHandlerProps = EventHandlerItemProps & {
  initMode: Symbol,
  showActions: boolean,
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
    <div className="Event__header">
      <div className="Event__header__buffer" />
      <div className="Event__header__title">
        <span>{name}</span>
      </div>
      {mode === Mode.EDIT ? (
        <div className="Event__header__buttons">
          <IconButton
            iconClassName="Event__header__buttons__trashIcon"
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
        <div className="Event__header__buffer" />
      )}
    </div>
  );
};

const hasErrors = errors =>
  Object.keys(errors).length !== 0 || errors.constructor !== Object;

export const NewEventHandler = (props: NewEventHandlerProps) => {
  return <EventHandler initMode={Mode.EDIT} showActions={false} {...props} />;
};

export const EventHandlerItem = (props: EventHandlerItemProps) => {
  return <EventHandler {...props} />;
};

const EventHandler = ({
  id,
  initMode,
  showActions,
  values,
  onSave,
  onDelete,
}: EventHandlerProps) => {
  const { events: eventOptions } = useContext(DeviceContext);
  const { events, actions } = values || { events: [], actions: [] };
  const persistKey = `EventHandler.${id}`;

  const [mode, setMode] = useState(initMode);
  return (
    <Formik initialValues={{ events }}>
      {formik => {
        return (
          <div className="Event">
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
            <FormikSelectInput
              className="Event__select"
              name="events"
              placeholder="Event Names"
              options={eventOptions.map(({ name, value }) => ({
                label: name,
                value,
              }))}
              formik={formik}
              isMulti
            />
            {showActions ? (
              <div className="Event__actionContainer">
                <MutableList
                  id={id}
                  items={actions}
                  itemComponent={ActionItem}
                  newItemComponent={NewAction}
                />
              </div>
            ) : null}
            <Persistence name={persistKey} formik={formik} />
          </div>
        );
      }}
    </Formik>
  );
};

NewEventHandler.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

NewEventHandler.defaultProps = {
  onDelete: () => {},
  onSave: () => {},
};

EventHandlerItem.propTypes = {
  id: PropTypes.string.isRequired,
  initMode: PropTypes.symbol,
  values: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(ItemPropsShape).isRequired,
  }),
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

EventHandlerItem.defaultProps = {
  initMode: Mode.SUMMARY,
  values: {
    events: [],
    actions: [],
  },
  onDelete: () => {},
  onSave: () => {},
};

EventHandler.propTypes = {
  id: PropTypes.string.isRequired,
  initMode: PropTypes.symbol,
  showActions: PropTypes.bool,
  values: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(ItemPropsShape).isRequired,
  }),
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

EventHandler.defaultProps = {
  initMode: Mode.SUMMARY,
  showActions: true,
  values: {
    events: [],
    actions: [],
  },
  onDelete: () => {},
  onSave: () => {},
};

export default EventHandler;
