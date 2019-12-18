// @flow
import type { ComponentType } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import uuidv4 from 'uuid/v4';

import PersistenceService from '../../services/persistence';
import type { ItemProps } from './MutableListItem';
import { ItemPropsShape } from './MutableListItem';

import './MutableList.scss';

type NewItemComponentProps = {
  id: string,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type ItemComponentProps = {
  id: string,
  kind?: string,
  values: any,
  onSave?: (id: string) => void,
  onDelete: (id: string) => void,
};

type MutableListProps = {
  id: string,
  items: ItemProps[],
  itemComponent: ComponentType<ItemComponentProps>,
  newItemComponent: ComponentType<NewItemComponentProps>,
  itemStyles: string,
};

const MutableList = (props: MutableListProps) => {
  const {
    id: parentId,
    items: remoteItems,
    itemComponent: Item,
    newItemComponent: NewItem,
    itemStyles,
  } = props;
  const [items, setItems] = useState([]);
  const [newItemId, setNewItemId] = useState(uuidv4());

  if (items.length === 0) {
    let initItems = PersistenceService.read(parentId);
    if (!initItems) {
      initItems = remoteItems.map(({ id, kind, values }) => ({
        id,
        kind: kind || '',
        values: values || null,
        status: 'saved',
      }));
    }
    if (initItems.length > 0) {
      PersistenceService.write(parentId, initItems);
      setItems(initItems);
    }
  }

  const itemComps = items
    .filter(({ status }) => status === 'saved')
    .map(({ id, kind, values }) => (
      <div key={id} className={itemStyles}>
        <Item
          id={id}
          kind={kind}
          values={values}
          onDelete={() => {
            const updated = items.filter(item => item.id !== id);
            // const item = items[idx];
            // item.status = 'disabled';
            // items[idx] = item;
            PersistenceService.write(parentId, updated);
            setItems(updated);
          }}
        />
      </div>
    ));

  return (
    <React.Fragment>
      {itemComps}
      <div className={itemStyles}>
        <NewItem
          id={newItemId}
          key={newItemId}
          onInit={({ id, kind }) => {
            const updated = items.concat({
              id,
              kind,
              values: null,
              status: 'init',
            });
            setItems(updated);
          }}
          onSave={() => {
            let updated;
            if (items.length > 0 && items[items.length - 1].status === 'init') {
              const { id, kind, values } = items[items.length - 1];
              updated = items
                .slice(0, -1)
                .concat({ id, kind, values, status: 'saved' });
            } else {
              updated = items.concat({
                id: newItemId,
                kind: '',
                values: null,
                status: 'saved',
              });
            }
            PersistenceService.write(parentId, updated);
            setItems(updated);
            setNewItemId(uuidv4());
          }}
          onDelete={() => {
            if (items.length > 0 && items[items.length - 1].status === 'init') {
              const updated = items.slice(0, -1);
              setItems(updated);
              setNewItemId(uuidv4());
            }
          }}
        />
      </div>
    </React.Fragment>
  );
};

MutableList.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ItemPropsShape).isRequired,
  // $FlowFixMe missing type def in flow-typed
  itemComponent: PropTypes.elementType.isRequired,
  // $FlowFixMe missing type def in flow-typed
  newItemComponent: PropTypes.elementType.isRequired,
  itemStyles: PropTypes.string,
};

MutableList.defaultProps = {
  itemStyles: 'MutableList__item',
};

export default MutableList;
