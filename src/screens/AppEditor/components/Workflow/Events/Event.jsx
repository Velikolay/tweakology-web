// @flow
import type { ComponentType } from 'react';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';

import Action, { ActionItem } from '../Actions';

import DeviceContext from '../../../contexts/DeviceContext';
import PersistenceService from '../../../../../services/persistence';

import './Event.scss';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

type ItemComponentProps = {
  id: string,
  kind: string,
  initValues?: any,
  onSave?: (id: string) => void,
  onDelete: (id: string) => void,
};

type NewItemComponentProps = {
  id: string,
  onSave: (id: string) => void,
  onDelete?: (id: string) => void,
};

type ItemProps = {
  id: string,
  kind: string,
  values: any,
};

type MutableListProps = {
  id: string,
  items: ItemProps[],
  itemComponent: ComponentType<ItemComponentProps>,
  newItemComponent: ComponentType<NewItemComponentProps>,
};

export const MutableList = (props: MutableListProps) => {
  const {
    id: parentId,
    items: remoteItems,
    itemComponent: Item,
    newItemComponent: NewItem,
  } = props;
  const [items, setItems] = useState([]);
  const [newItemId, setNewItemId] = useState(uuidv4());
  if (items.length === 0) {
    let initItems = PersistenceService.read(parentId);
    if (!initItems) {
      initItems = remoteItems.map(({ id }) => ({ id }));
    }
    if (initItems.length > 0) {
      PersistenceService.write(parentId, initItems);
      setItems(initItems);
    }
  }
  console.log(items);
  const itemComps = items.map(({ id }) => {
    const itemProps = remoteItems.find(item => item.id === id);
    const initValues = itemProps ? itemProps.values : null;
    return (
      <Item
        id={id}
        key={id}
        kind="AttributeExpression"
        initValues={initValues}
        onDelete={() => {
          const updated = items.filter(item => item.id !== id);
          console.log(updated);
          // const item = list.items[idx];
          // item.status = 'disabled';
          // list.items[idx] = item;
          PersistenceService.write(parentId, updated);
          setItems(updated);
          console.log('Delete invoked');
        }}
      />
    );
  });

  return (
    <React.Fragment>
      {itemComps}
      <NewItem
        id={newItemId}
        key={newItemId}
        onSave={() => {
          const updated = items.concat({ id: newItemId });
          PersistenceService.write(parentId, updated);
          setItems(updated);
          setNewItemId(uuidv4());
        }}
      />
    </React.Fragment>
  );
};

MutableList.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemComponent: PropTypes.elementType.isRequired,
  newItemComponent: PropTypes.elementType.isRequired,
};

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
