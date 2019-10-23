// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

import Select from '../../../../../components/InputFields/SelectInput';

import { ActionMode } from './Action';
import AttributeExpression from './AttributeExpression';

type ActionProps = {
  id: string,
  onDelete: (id: string) => void,
};

const ACTION_TYPE_OPTIONS = [
  { value: 'expression', label: 'Attribute Expression' },
  { value: 'http_request', label: 'HTTP Request' },
];

const Action = ({ id, onDelete }: ActionProps) => {
  const [type, setType] = React.useState(null);
  if (type !== null) {
    return (
      <AttributeExpression
        id={id}
        initMode={ActionMode.EDIT}
        onDelete={onDelete}
      />
    );
  }
  return (
    <Select
      className="AttributeExpressionForm__attributes"
      name="attributes"
      placeholder="Action Type"
      options={ACTION_TYPE_OPTIONS}
      onChange={value => setType(value)}
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
