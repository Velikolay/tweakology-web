// @flow
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { IconContext } from 'react-icons';
import { FaCode } from 'react-icons/fa';

import type { ActionContentProps } from './ActionHOC';
import withAction, { ActionMode } from './ActionHOC';

import Toggle from '../../../../../components/InputFields/Toggle';
import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';
import TextArea from '../../../../../components/InputFields/TextArea';

import RuntimeContext from '../../../contexts/RuntimeContext';

import './AttributeExpression.scss';

type AttributeExpressionActionState = {
  rerenderToggle: boolean,
  attributes: { value: string, label: string }[],
  attributeExpression: string,
};

type AttributeExpressionActionFormik = {
  formik: {
    values: AttributeExpressionActionState,
    errors: {
      rerenderToggle: string,
      attributes: string,
      attributeExpression: string,
    },
    setFieldValue: (string, any) => void,
  },
};

const InitialValues = {
  rerenderToggle: false,
  attributes: [],
  attributeExpression: '',
};

const ValidationSchema = Yup.object().shape({
  rerenderToggle: Yup.boolean().required('Required'),
  attributes: Yup.array()
    .min(1, 'At least one attribute required')
    .required('Required'),
  attributeExpression: Yup.string(),
});

const AttributeExpressionAction = ({
  id,
  mode,
  formik,
}: ActionContentProps) => {
  const { values } = formik;
  return mode === ActionMode.SUMMARY ? (
    <AttributeExpressionActionSummary {...values} />
  ) : (
    <AttributeExpressionActionEdit formik={formik} />
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
  errors: PropTypes.shape({
    rerenderToggle: PropTypes.string,
    attributes: PropTypes.string,
    attributeExpression: PropTypes.string,
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
});

AttributeExpressionAction.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.symbol.isRequired,
  formik: FormikShape.isRequired,
};

const AttributeExpressionActionSummary = ({
  rerenderToggle,
  attributes,
  attributeExpression,
}: AttributeExpressionActionState) => (
  <div className="AttributeExpressionSummary">
    <IconContext.Provider
      value={{ className: 'AttributeExpressionSummary__actionIcon' }}
    >
      <FaCode />
    </IconContext.Provider>
    <div className="AttributeExpressionSummary__text">Update attributes</div>
    <div className="AttributeExpressionSummary__attributes">
      {attributes.map(({ label }, idx) => (
        <React.Fragment key={label}>
          {idx > 0 ? <span> , </span> : null}
          <span className="AttributeExpressionSummary__attributes__label">
            {label}
          </span>
        </React.Fragment>
      ))}
    </div>
    {rerenderToggle ? (
      <div className="AttributeExpressionSummary__text">and rerender</div>
    ) : null}
  </div>
);

const AttributeExpressionActionEdit = ({
  formik,
}: AttributeExpressionActionFormik) => (
  <RuntimeContext.Consumer>
    {({ attributes }) => (
      <Fragment>
        <Toggle
          className="AttributeExpressionForm__rerenderToggle"
          name="rerenderToggle"
          title="Rerender"
          formik={formik}
        />
        <FormikSelectInput
          className="AttributeExpressionForm__attributes"
          name="attributes"
          placeholder="Attribute Name"
          options={Object.keys(attributes).map(name => ({
            value: name,
            label: name,
          }))}
          formik={formik}
          isMulti
          creatable
        />
        <TextArea
          className="AttributeExpressionForm__expression"
          name="attributeExpression"
          placeholder="Attribute Expression"
          rows={6}
          formik={formik}
        />
      </Fragment>
    )}
  </RuntimeContext.Consumer>
);

AttributeExpressionActionEdit.propTypes = {
  formik: FormikShape.isRequired,
};

export default withAction(
  AttributeExpressionAction,
  InitialValues,
  ValidationSchema,
);
