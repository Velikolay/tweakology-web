// @flow
import * as React from 'react';
import PropTypes from 'prop-types';

import Select from '../../../../../components/InputFields/SelectInput';

import { ActionMode } from './Action';
import AttributeExpression from './AttributeExpression';

type ActionProps = {
  id: string,
};

const ACTION_TYPE_OPTIONS = [
  { value: 'expression', label: 'Attribute Expression' },
  { value: 'http_request', label: 'HTTP Request' },
];

const Action = ({ id }: ActionProps) => {
  const [type, setType] = React.useState(null);
  if (type !== null) {
    return <AttributeExpression id={id} initMode={ActionMode.EDIT} />;
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
};

export default Action;
