// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
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

type UpdateAttributeActionSummaryProps = {
  rerenderToggle: boolean,
  attributes: { value: string, label: string }[],
  attributeExpression: string,
};

const UpdateAttributeActionSummary = ({
  rerenderToggle,
  attributes,
  attributeExpression,
}: UpdateAttributeActionSummaryProps) => {
  return (
    <div className="UpdateAttributeSummary">
      <IconContext.Provider
        value={{ className: 'UpdateAttributeSummary__actionIcon' }}
      >
        <FaCode />
      </IconContext.Provider>
      <div className="UpdateAttributeSummary__text">Update attributes</div>
      <div className="UpdateAttributeSummary__attributes">
        {attributes.map(({ label }, idx) => (
          <React.Fragment>
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
};

const UpdateAttributeAction = ({ id, mode }: ActionContentProps) => {
  return (
    <Formik
      initialValues={{
        rerenderToggle: false,
        attributes: [],
        attributeExpression: '',
      }}
    >
      {({ values, setFieldValue }) => {
        return mode === ActionMode.SUMMARY ? (
          <UpdateAttributeActionSummary {...values} />
        ) : (
          <Form className="UpdateAttributeForm">
            <Toggle
              disabled={mode !== ActionMode.EDIT}
              className="UpdateAttributeForm__rerenderToggle"
              name="rerenderToggle"
              title="Rerender"
              formik={{ values, setFieldValue }}
            />
            <Select
              disabled={mode !== ActionMode.EDIT}
              className="UpdateAttributeForm__attributes"
              name="attributes"
              placeholder="Attribute Name"
              options={options}
              formik={{ values, setFieldValue }}
              isMulti
              creatable
            />
            <TextArea
              disabled={mode !== ActionMode.EDIT}
              className="UpdateAttributeForm__expression"
              name="attributeExpression"
              placeholder="Attribute Expression"
              rows={6}
              formik={{ values, setFieldValue }}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

UpdateAttributeAction.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.symbol.isRequired,
};

export default withAction(UpdateAttributeAction);
