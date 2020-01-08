// @flow
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import uuidv4 from 'uuid/v4';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { readList, writeList } from './operations';

import type { MutableListItemType } from './types';
import { MutableListItemShape } from './shapes';

import './MutableList.scss';

const MutableListElementStatus = Object.freeze({
  INIT: 'init',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
});

type NewItemComponentProps = {
  id: string,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type ItemComponentProps = {
  id: string,
  kind: string,
  values: any,
  onSave?: (id: string) => void,
  onDelete: (id: string) => void,
};

type MutableListProps = {
  id: string,
  items: MutableListItemType[],
  itemComponent: React$ComponentType<ItemComponentProps>,
  newItemComponent: React$ComponentType<NewItemComponentProps>,
  itemStyles: string,
  sortable: boolean,
  genId: () => string,
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const MutableList = (props: MutableListProps) => {
  const {
    id: parentId,
    items: remoteItems,
    itemComponent: Item,
    newItemComponent: NewItem,
    itemStyles,
    sortable,
    genId,
  } = props;
  const listId = `${parentId}.list`;
  const [items, setItems] = useState([]);
  const [newItemId, setNewItemId] = useState(genId());

  if (items.length === 0) {
    let initItems = readList(parentId);
    if (!initItems) {
      initItems = remoteItems.map(({ id, kind, values }) => ({
        id,
        status: MutableListElementStatus.ENABLED,
        kind: kind || null,
        values: values || null,
      }));
    }
    if (initItems.length > 0) {
      writeList(parentId, initItems);
      setItems(initItems);
    }
  }

  const itemComps = items
    .filter(({ status }) => status === MutableListElementStatus.ENABLED)
    .map(({ id, kind, values }, index) => (
      <Draggable
        key={id}
        draggableId={id}
        index={index}
        isDragDisabled={!sortable}
      >
        {(provided, snapshot) => (
          <div
            className={itemStyles}
            ref={provided.innerRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...provided.draggableProps}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...provided.dragHandleProps}
          >
            <Item
              id={id}
              // $FlowFixMe
              kind={kind}
              values={values}
              onDelete={() => {
                const updated = items.filter(item => item.id !== id);
                writeList(parentId, updated);
                setItems(updated);
              }}
            />
          </div>
        )}
      </Draggable>
    ));

  return (
    <>
      <DragDropContext
        onDragEnd={result => {
          if (!result.destination) {
            return;
          }

          const reorderedItems = reorder(
            items,
            result.source.index,
            result.destination.index,
          );

          writeList(parentId, reorderedItems);
          setItems(reorderedItems);
        }}
      >
        <Droppable droppableId={listId} isDropDisabled={!sortable}>
          {(provided, snapshot) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {itemComps}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className={itemStyles}>
        <NewItem
          id={newItemId}
          key={newItemId}
          onInit={({ id, kind }) => {
            const updated = items.concat({
              id,
              status: MutableListElementStatus.INIT,
              kind,
              values: null,
            });
            setItems(updated);
          }}
          onSave={() => {
            let updated;
            if (
              items.length > 0 &&
              items[items.length - 1].status === MutableListElementStatus.INIT
            ) {
              const { id, kind, values } = items[items.length - 1];
              updated = items.slice(0, -1).concat({
                id,
                status: MutableListElementStatus.ENABLED,
                kind,
                values,
              });
            } else {
              updated = items.concat({
                id: newItemId,
                status: MutableListElementStatus.ENABLED,
                kind: null,
                values: null,
              });
            }
            writeList(parentId, updated);
            setItems(updated);
            setNewItemId(genId());
          }}
          onDelete={() => {
            if (
              items.length > 0 &&
              items[items.length - 1].status === MutableListElementStatus.INIT
            ) {
              const updated = items.slice(0, -1);
              setItems(updated);
              setNewItemId(genId());
            }
          }}
        />
      </div>
    </>
  );
};

MutableList.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(MutableListItemShape).isRequired,
  // $FlowFixMe missing type def in flow-typed
  itemComponent: PropTypes.elementType.isRequired,
  // $FlowFixMe missing type def in flow-typed
  newItemComponent: PropTypes.elementType.isRequired,
  itemStyles: PropTypes.string,
  sortable: PropTypes.bool,
  genId: PropTypes.func,
};

MutableList.defaultProps = {
  itemStyles: 'MutableList__item',
  sortable: false,
  genId: uuidv4,
};

export default MutableList;
