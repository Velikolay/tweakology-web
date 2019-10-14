// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';

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

const UpdateAttributeAction = ({ id, mode }: ActionContentProps) => {
  return (
    <Formik
      initialValues={{
        rerenderToggle: false,
        attributeName: '',
        attributeExpression: '',
      }}
    >
      {({ values, setFieldValue }) => {
        return (
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
              className="UpdateAttributeForm__attribute"
              name="attributeName"
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
