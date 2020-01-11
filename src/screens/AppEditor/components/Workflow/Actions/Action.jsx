// @flow
import React from 'react';
import PropTypes from 'prop-types';

import uuidv4 from 'uuid/v4';

import type { ActionType } from './types';
import AttributeExpression from './AttributeExpression';

import {
  readItem,
  MutableListItemMode,
} from '../../../../../components/MutableList';
import { SelectInputUncontrolled } from '../../../../../components/InputFields/SelectInput';

import './Action.scss';

const ACTION_OPTIONS = [
  { value: 'AttributeExpression', label: 'Attribute Expression' },
  { value: 'AttributeExpression', label: 'HTTP Request' },
];

const ACTIONS = {
  AttributeExpression,
};

type NewActionProps = {
  id: string,
  onInit: ({ id: string }) => void,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type ActionItemProps = {
  id: string,
  data: ?ActionType,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

export const ActionItem = ({
  id,
  data: remoteData,
  onSave,
  onDelete,
}: ActionItemProps) => {
  const data = remoteData || readItem(id, 'values');
  if (data && data.type in ACTIONS) {
    const ActionComponent = ACTIONS[data.type];
    return (
      <ActionComponent
        id={id}
        mode={MutableListItemMode.SUMMARY}
        data={data}
        onSave={onSave}
        onDelete={onDelete}
      />
    );
  }
  return null;
};

export const NewAction = ({ id, onInit, onSave, onDelete }: NewActionProps) => {
  const [kind, setKind] = React.useState(null);
  if (kind !== null) {
    const ActionComponent = ACTIONS[kind];
    return (
      <ActionComponent
        id={id}
        mode={MutableListItemMode.EDIT}
        onSave={onSave}
        onDelete={onDelete}
      />
    );
  }
  return (
    <SelectInputUncontrolled
      className="Action__select"
      placeholder="Action Type"
      options={ACTION_OPTIONS}
      onChange={({ value }) => {
        setKind(value);
        onInit({ id });
      }}
    />
  );
};

export const genActionId = () => `Actions.${uuidv4()}`;

ActionItem.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    values: PropTypes.objectOf(PropTypes.any),
  }),
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

ActionItem.defaultProps = {
  data: null,
  onSave: () => {},
};

NewAction.propTypes = {
  id: PropTypes.string.isRequired,
  onInit: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

NewAction.defaultProps = {
  onInit: () => {},
  onSave: () => {},
  onDelete: () => {},
};
