// @flow
import React, { useContext } from 'react';
import { Formik, Form } from 'formik';

import type { UIViewNode } from '../../../types';
import type { AnyUIView } from '../../../../../services/device/types';

import Select from '../../../../../components/InputFields/Select';
import Button from '../../../../../components/InputFields/Button';

import Action from '../Actions';
import UpdateAttributeAction from '../Actions/UpdateAttribute';

import DeviceContext from '../../../contexts/DeviceContext';
import { TreeViewNodeShape } from '../../Tree/Shapes';

import './Events.scss';

const EventListenerSetupFrom = () => {
  const { events } = useContext(DeviceContext);
  return (
    <Formik
      // initialValues={{ id: '', type: '' }}
      // validationSchema={ValidationSchema}
      onSubmit={({ id, type }, { setSubmitting }) => {
        setSubmitting(false);
      }}
    >
      <Form className="Events__listenerSetupForm">
        <Select className="Events__listenerSetupForm__select" name="event">
          {events.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </Select>
        <Button className="Events__listenerSetupForm__submit">Add</Button>
      </Form>
    </Formik>
  );
};

type EventsProps = {
  activeNode: UIViewNode<AnyUIView>,
};

const Events = ({ activeNode }: EventsProps) => {
  return (
    <div className="Events">
      <div className="Events__title">{`${activeNode.module} Events`}</div>
      <EventListenerSetupFrom />
      <Action id="test" />
      {/* <UpdateAttributeAction id="test" /> */}
    </div>
  );
};

Events.propTypes = {
  activeNode: TreeViewNodeShape.isRequired,
};

export default Events;
