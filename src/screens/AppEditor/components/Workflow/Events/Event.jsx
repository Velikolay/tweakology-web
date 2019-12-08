// @flow
import React, { useContext } from 'react';
import { Formik } from 'formik';

import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';
import MutableList from '../../../../../components/MutableList';

import Action, { ActionItem } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';

import './Event.scss';

const Event = () => {
  const { events } = useContext(DeviceContext);
  return (
    <Formik>
      {formik => {
        return (
          <div className="Event">
            <FormikSelectInput
              className="Event__select"
              name="events"
              placeholder="Event Names"
              options={events.map(({ name, value }) => ({
                label: name,
                value,
              }))}
              formik={formik}
              isMulti
            />
            <div className="Event__actionContainer">
              <MutableList
                id="test"
                items={[]}
                itemComponent={ActionItem}
                newItemComponent={Action}
              />
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default Event;
