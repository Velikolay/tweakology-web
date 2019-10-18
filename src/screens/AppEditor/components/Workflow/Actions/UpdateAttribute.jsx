// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'formik';
import { IconContext } from 'react-icons';
import { FaCode } from 'react-icons/fa';

import withAction, { ActionMode } from './Action';
import type { ActionContentProps } from './Action';

import Toggle from '../../../../../components/InputFields/Toggle';
import Select from '../../../../../components/InputFields/SelectInput';
import TextArea from '../../../../../components/InputFields/TextArea';

import './UpdateAttribute.scss';

const options = [
  { value: 'Chocolate', label: 'Chocolate' },
  { value: 'Strawberry', label: 'Strawberry' },
  { value: 'Vanilla', label: 'Vanilla' },
];

type UpdateAttributeActionState = {
  rerenderToggle: boolean,
  attributes: { value: string, label: string }[],
  attributeExpression: string,
};

type UpdateAttributeActionFormik = {
  formik: {
    values: UpdateAttributeActionState,
    setFieldValue: (string, any) => void,
  },
};

const INITIAL_VALUES = {
  rerenderToggle: false,
  attributes: [],
  attributeExpression: '',
};

const UpdateAttributeAction = ({
  id,
  mode,
  formik: { values, setFieldValue },
}: ActionContentProps) => {
  return mode === ActionMode.SUMMARY ? (
    <UpdateAttributeActionSummary {...values} />
  ) : (
    <UpdateAttributeActionEdit formik={{ values, setFieldValue }} />
  );
};

const FormikShape = PropTypes.shape({
  values: PropTypes.shape({
    rerenderToggle: PropTypes.bool.isRequired,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
    attributeExpression: PropTypes.string.isRequired,
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
});

UpdateAttributeAction.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.symbol.isRequired,
  formik: FormikShape.isRequired,
};

const UpdateAttributeActionSummary = ({
  rerenderToggle,
  attributes,
  attributeExpression,
}: UpdateAttributeActionState) => (
  <div className="UpdateAttributeSummary">
    <IconContext.Provider
      value={{ className: 'UpdateAttributeSummary__actionIcon' }}
    >
      <FaCode />
    </IconContext.Provider>
    <div className="UpdateAttributeSummary__text">Update attributes</div>
    <div className="UpdateAttributeSummary__attributes">
      {attributes.map(({ label }, idx) => (
        <React.Fragment key={label}>
          {idx > 0 ? <span> , </span> : null}
          <span className="UpdateAttributeSummary__attributes__label">
            {label}
          </span>
        </React.Fragment>
      ))}
    </div>
    {rerenderToggle ? (
      <div className="UpdateAttributeSummary__text">and rerender</div>
    ) : null}
  </div>
);

const UpdateAttributeActionEdit = ({
  formik: { values, setFieldValue },
}: UpdateAttributeActionFormik) => (
  <Form className="UpdateAttributeForm">
    <Toggle
      className="UpdateAttributeForm__rerenderToggle"
      name="rerenderToggle"
      title="Rerender"
      formik={{ values, setFieldValue }}
    />
    <Select
      className="UpdateAttributeForm__attributes"
      name="attributes"
      placeholder="Attribute Name"
      options={options}
      formik={{ values, setFieldValue }}
      isMulti
      creatable
    />
    <TextArea
      className="UpdateAttributeForm__expression"
      name="attributeExpression"
      placeholder="Attribute Expression"
      rows={6}
      formik={{ values, setFieldValue }}
    />
  </Form>
);

UpdateAttributeActionEdit.propTypes = {
  formik: FormikShape.isRequired,
};

export default withAction(UpdateAttributeAction, INITIAL_VALUES);
