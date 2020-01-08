// @flow
import React from 'react';
import PropTypes from 'prop-types';

import uuidv4 from 'uuid/v4';

import AttributeExpression from './AttributeExpression';

import { MutableListItemMode } from '../../../../../components/MutableList';
import { SelectInputUncontrolled } from '../../../../../components/InputFields/SelectInput';

import './Action.scss';

const ACTION_OPTIONS = [
  { value: 'AttributeExpression', label: 'Attribute Expression' },
  { value: 'AttributeExpression', label: 'HTTP Request' },
];

const ACTIONS = {
  AttributeExpression,
};

type ActionProps = {
  id: string,
  onInit: ({ id: string, kind: string }) => void,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type ActionItemProps = {
  id: string,
  kind: string,
  values: any,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

export const ActionItem = ({
  id,
  kind,
  values,
  onSave,
  onDelete,
}: ActionItemProps) => {
  if (kind in ACTIONS) {
    const ActionComponent = ACTIONS[kind];
    return (
      <ActionComponent
        id={id}
        mode={MutableListItemMode.SUMMARY}
        values={values}
        onSave={onSave}
        onDelete={onDelete}
      />
    );
  }
  return null;
};

export const NewAction = ({ id, onInit, onSave, onDelete }: ActionProps) => {
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
        onInit({ id, kind: value });
      }}
    />
  );
};

export const genActionId = () => `Actions.${uuidv4()}`;

ActionItem.propTypes = {
  id: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  values: PropTypes.objectOf(PropTypes.any),
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

ActionItem.defaultProps = {
  onSave: () => {},
  values: null,
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

export default NewAction;
