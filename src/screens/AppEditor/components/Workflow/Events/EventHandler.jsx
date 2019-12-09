// @flow
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';
import type { ItemProps } from '../../../../../components/MutableList';
import MutableList, {
  ItemPropsShape,
} from '../../../../../components/MutableList';

import Action, { ActionItem } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';
import Persistence from '../../../form/Presistence';

import './EventHandler.scss';

type EventHandlerProps = {
  id: string,
};

type EventHandlerItemProps = {
  id: string,
  values: {
    events: string[],
    actions: ItemProps[],
  },
};

const EventHandler = ({ id }: EventHandlerProps) => {
  return <EventHandlerItem id={id} values={{ events: [], actions: [] }} />;
};

export const EventHandlerItem = ({ id, values }: EventHandlerItemProps) => {
  const { events: eventOptions } = useContext(DeviceContext);
  const { events, actions } = values;
  const persistKey = `EventHandler.${id}`;
  return (
    <Formik initialValues={{ events }}>
      {formik => {
        return (
          <div className="Event">
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
            <div className="Event__actionContainer">
              <MutableList
                id={id}
                items={actions}
                itemComponent={ActionItem}
                newItemComponent={Action}
              />
            </div>
            <Persistence name={persistKey} formik={formik} />
          </div>
        );
      }}
    </Formik>
  );
};

EventHandler.protoTypes = {
  id: PropTypes.string.isRequired,
};

EventHandlerItem.propTypes = {
  id: PropTypes.string.isRequired,
  values: PropTypes.shape({
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(ItemPropsShape).isRequired,
  }),
};

EventHandlerItem.defaultProps = {
  values: {
    events: [],
    actions: [],
  },
};

export default EventHandler;
