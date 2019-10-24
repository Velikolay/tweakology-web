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

type ActionProps = {
  id: string,
  onDelete: (id: string) => void,
};

const Action = ({ id, onDelete }: ActionProps) => {
  const [action, setAction] = React.useState(null);
  if (action !== null) {
    const ActionComponent = action.value;
    return (
      <ActionComponent id={id} initMode={ActionMode.EDIT} onDelete={onDelete} />
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

Action.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

Action.defaultProps = {
  onDelete: () => {},
};

export default Action;
