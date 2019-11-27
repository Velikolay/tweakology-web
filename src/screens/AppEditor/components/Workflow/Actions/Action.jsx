// @flow
import React from 'react';
import PropTypes from 'prop-types';

import { ActionMode } from './ActionHOC';
import AttributeExpression from './AttributeExpression';

import Select from '../../../../../components/InputFields/SelectInput';

const ACTION_OPTIONS = [
  { value: AttributeExpression, label: 'Attribute Expression' },
  { value: AttributeExpression, label: 'HTTP Request' },
];

const ACTIONS = {
  AttributeExpression,
};

type ActionProps = {
  id: string,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

type ActionItemProps = {
  id: string,
  kind: string,
  onDelete: (id: string) => void,
  onSave?: (id: string) => void,
  initValues?: any,
};

export const ActionItem = ({
  id,
  kind,
  initValues,
  onSave,
  onDelete,
}: ActionItemProps) => {
  if (kind in ACTIONS) {
    const ActionComponent = ACTIONS[kind];
    return (
      <ActionComponent
        id={id}
        initMode={ActionMode.SUMMARY}
        initValues={initValues}
        onSave={onSave}
        onDelete={onDelete}
      />
    );
  }
  return null;
};

const Action = ({ id, onSave, onDelete }: ActionProps) => {
  const [action, setAction] = React.useState(null);
  if (action !== null) {
    const ActionComponent = action.value;
    return (
      <ActionComponent
        id={id}
        initMode={ActionMode.EDIT}
        onSave={onSave}
        onDelete={onDelete}
      />
    );
  }
  return (
    <Select
      className="AttributeExpressionForm__attributes"
      name="attributes"
      placeholder="Action Type"
      options={ACTION_OPTIONS}
      onChange={value => setAction(value)}
    />
  );
};

ActionItem.propTypes = {
  id: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  initValues: PropTypes.any,
};

ActionItem.defaultProps = {
  onSave: () => {},
  initValues: null,
};

Action.propTypes = {
  id: PropTypes.string.isRequired,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
};

Action.defaultProps = {
  onSave: () => {},
  onDelete: () => {},
};

export default Action;
