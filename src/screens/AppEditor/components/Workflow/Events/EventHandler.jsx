// @flow
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import uuidv4 from 'uuid/v4';

import SelectInput from '../../../../../components/InputFields/SelectInput';

import type {
  MutableListItemType,
  MutableListItemModeType,
} from '../../../../../components/MutableList';
import MutableList, {
  MutableListItem,
  MutableListItemMode,
  MutableListItemShape,
} from '../../../../../components/MutableList';

import { NewAction, ActionItem, genActionId } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';

import './EventHandler.scss';

type EventHandlerType = {
  events: string[],
  actions: MutableListItemType[],
};

type NewEventHandlerProps = {
  id: string,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type EventHandlerItemProps = NewEventHandlerProps & {
  data: ?EventHandlerType,
};

type EventHandlerProps = EventHandlerItemProps & {
  mode: MutableListItemModeType,
  showActions: boolean,
};

export const NewEventHandler = ({
  id,
  onSave,
  onDelete,
}: NewEventHandlerProps) => {
  return (
    <EventHandler
      id={id}
      showActions={false}
      mode={MutableListItemMode.EDIT}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
};

export const EventHandlerItem = ({
  id,
  data,
  onSave,
  onDelete,
}: EventHandlerItemProps) => {
  return (
    <EventHandler id={id} data={data} onSave={onSave} onDelete={onDelete} />
  );
};

export const genEventHandlerId = () => `EventHandlers.${uuidv4()}`;

const ValidationSchema = Yup.object().shape({
  events: Yup.array()
    .min(1, 'At least one event required')
    .required('Required'),
});

const EventHandler = ({
  id,
  mode: initMode,
  data,
  onSave,
  onDelete,
  showActions,
}: EventHandlerProps) => {
  const { events: eventOptions } = useContext(DeviceContext);
  const { events, actions } = data || { events: [], actions: [] };

  return (
    <Formik initialValues={{ events }} validationSchema={ValidationSchema}>
      {formik => (
        <>
          <MutableListItem
            id={id}
            mode={initMode}
            formik={formik}
            autosave={false}
            onSave={onSave}
            onDelete={onDelete}
          >
            {(_, mode) =>
              mode === MutableListItemMode.EDIT ? (
                <SelectInput
                  className="EventHandlerEdit__select"
                  name="events"
                  placeholder="Event Names"
                  options={eventOptions.map(({ name, value }) => ({
                    label: name,
                    value,
                  }))}
                  formik={formik}
                  isMulti
                />
              ) : (
                <div className="EventHandlerSummary">
                  <div className="EventHandlerSummary__text">On</div>
                  <div className="EventHandlerSummary__attributes">
                    {formik.values.events.map(({ label }, idx) => (
                      <React.Fragment key={label}>
                        {idx > 0 ? <span> , </span> : null}
                        <span className="EventHandlerSummary__attributes__label">
                          {label}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )
            }
          </MutableListItem>
          {showActions ? (
            <div className="EventHandler__actionContainer">
              <MutableList
                sortable
                id={id}
                items={actions}
                itemComponent={ActionItem}
                newItemComponent={NewAction}
                genId={genActionId}
              />
            </div>
          ) : null}
        </>
      )}
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
  ...NewEventHandler.propTypes,
  data: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(MutableListItemShape).isRequired,
  }),
};

EventHandlerItem.defaultProps = {
  ...NewEventHandler.defaultProps,
  data: {
    events: [],
    actions: [],
  },
};

EventHandler.propTypes = {
  ...EventHandlerItem.propTypes,
  mode: PropTypes.string,
  showActions: PropTypes.bool,
};

EventHandler.defaultProps = {
  ...EventHandlerItem.defaultProps,
  mode: MutableListItemMode.SUMMARY,
  showActions: true,
};

export default EventHandler;
