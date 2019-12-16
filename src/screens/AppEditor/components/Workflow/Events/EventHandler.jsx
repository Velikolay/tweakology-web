// @flow
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';
import type { ItemProps } from '../../../../../components/MutableList';
import MutableList, {
  ItemPropsShape,
} from '../../../../../components/MutableList';
import MutableListItem, {
  Mode,
} from '../../../../../components/MutableList/MutableListItem';

import { NewAction, ActionItem } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';

import './EventHandler.scss';

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
  mode: Symbol,
  showActions: boolean,
};

export const NewEventHandler = (props: NewEventHandlerProps) => {
  return <EventHandler mode={Mode.EDIT} showActions={false} {...props} />;
};

export const EventHandlerItem = (props: EventHandlerItemProps) => {
  return <EventHandler {...props} />;
};

const EventHandler = ({
  id,
  mode: initMode,
  showActions,
  values,
  onSave,
  onDelete,
}: EventHandlerProps) => {
  const { events: eventOptions } = useContext(DeviceContext);
  const { events, actions } = values || { events: [], actions: [] };
  const persistKey = `EventHandler.${id}`;

  return (
    <Formik initialValues={{ events }}>
      {formik => (
        <React.Fragment>
          <MutableListItem
            id={id}
            persistKey={persistKey}
            mode={initMode}
            formik={formik}
            autosave={false}
            onSave={onSave}
            onDelete={onDelete}
          >
            {(_, mode) =>
              mode === Mode.EDIT ? (
                <FormikSelectInput
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
                id={id}
                items={actions}
                itemComponent={ActionItem}
                newItemComponent={NewAction}
              />
            </div>
          ) : null}
        </React.Fragment>
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
  id: PropTypes.string.isRequired,
  mode: PropTypes.symbol,
  values: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(ItemPropsShape).isRequired,
  }),
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

EventHandlerItem.defaultProps = {
  mode: Mode.SUMMARY,
  values: {
    events: [],
    actions: [],
  },
  onDelete: () => {},
  onSave: () => {},
};

EventHandler.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.symbol,
  showActions: PropTypes.bool,
  values: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(ItemPropsShape).isRequired,
  }),
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

EventHandler.defaultProps = {
  mode: Mode.SUMMARY,
  showActions: true,
  values: {
    events: [],
    actions: [],
  },
  onDelete: () => {},
  onSave: () => {},
};

export default EventHandler;
