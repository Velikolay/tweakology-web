// @flow
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import uuidv4 from 'uuid/v4';

import SelectInput from '../../../../../components/InputFields/SelectInput';

import type { MutableListItemModeType } from '../../../../../components/MutableList';
import MutableList, {
  MutableListItem,
  MutableListItemMode,
} from '../../../../../components/MutableList';

import { NewAction, ActionItem, genActionId } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';
import RuntimeContext from '../../../contexts/RuntimeContext';

import './EventHandler.scss';

type EventHandlerType = {
  events: string[],
  actions: string[],
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
  const { actions: remoteActions } = useContext(RuntimeContext);

  const { events, actions } = data || { events: [], actions: [] };
  const actionItems = actions
    .filter(aid => aid in remoteActions)
    .map(aid => ({
      id: aid,
      data: remoteActions[aid],
    }));

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
                    value: name,
                  }))}
                  formik={formik}
                  isMulti
                  valueOnly
                />
              ) : (
                <div className="EventHandlerSummary">
                  <div className="EventHandlerSummary__text">On</div>
                  <div className="EventHandlerSummary__attributes">
                    {formik.values.events.map((event, idx) => (
                      <React.Fragment key={event}>
                        {idx > 0 ? <span> , </span> : null}
                        <span className="EventHandlerSummary__attributes__label">
                          {event}
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
                items={actionItems}
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
    actions: PropTypes.arrayOf(PropTypes.string).isRequired,
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
