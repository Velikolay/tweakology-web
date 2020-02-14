// @flow
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { IconContext } from 'react-icons';
import { FaCode } from 'react-icons/fa';

import type { ActionContentProps } from './ActionHOC';
import withAction from './ActionHOC';

import Toggle from '../../../../../components/InputFields/Toggle';
import SelectInput from '../../../../../components/InputFields/SelectInput';
import LiquidCodeEditor from '../../../../../components/InputFields/LiquidCodeEditor';
import { MutableListItemMode } from '../../../../../components/MutableList';

import RuntimeContext from '../../../contexts/RuntimeContext';

import './AttributeExpression.scss';

type AttributeExpressionActionState = {
  rerender: boolean,
  attributeName: string,
  expression: string,
};

type AttributeExpressionActionError = {
  rerender: string,
  attributeName: string,
  expression: string,
};

type AttributeExpressionActionFormik = {
  formik: {
    values: {
      args: AttributeExpressionActionState,
    },
    errors: {
      args: AttributeExpressionActionError,
    },
    setFieldValue: (string, any) => void,
  },
};

const InitialValues = {
  type: 'AttributeExpression',
  args: {
    rerender: false,
    attributeName: '',
    expression: '',
  },
};

const ValidationSchema = Yup.object().shape({
  args: Yup.object().shape({
    rerender: Yup.boolean().required('Required'),
    attributeName: Yup.string()
      .min(3, 'Attribute name should be at least 3 characters long')
      .required('Required'),
    expression: Yup.string(),
  }),
});

const AttributeExpressionAction = ({
  id,
  mode,
  formik,
}: ActionContentProps) => {
  const {
    values: {
      args: { rerender, attributeName, expression },
    },
  } = formik;
  return mode === MutableListItemMode.SUMMARY ? (
    <AttributeExpressionActionSummary
      rerender={rerender}
      attributeName={attributeName}
      expression={expression}
    />
  ) : (
    <AttributeExpressionActionEdit formik={formik} />
  );
};

const FormikShape = PropTypes.shape({
  values: PropTypes.shape({
    args: PropTypes.shape({
      rerender: PropTypes.bool.isRequired,
      attributeName: PropTypes.string.isRequired,
      expression: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    args: PropTypes.shape({
      rerender: PropTypes.string,
      attributeName: PropTypes.string,
      expression: PropTypes.string,
    }),
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
});

AttributeExpressionAction.propTypes = {
  id: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  formik: FormikShape.isRequired,
};

const AttributeExpressionActionSummary = ({
  rerender,
  attributeName,
  expression,
}: AttributeExpressionActionState) => (
  <div className="AttributeExpressionSummary">
    <IconContext.Provider
      value={{ className: 'AttributeExpressionSummary__actionIcon' }}
    >
      <FaCode />
    </IconContext.Provider>
    <div className="AttributeExpressionSummary__text">Update attributes</div>
    <div className="AttributeExpressionSummary__attributes">
      <span className="AttributeExpressionSummary__attributes__label">
        {attributeName}
      </span>
    </div>
    {rerender ? (
      <div className="AttributeExpressionSummary__text">and rerender</div>
    ) : null}
  </div>
);

const AttributeExpressionActionEdit = ({
  formik,
}: AttributeExpressionActionFormik) => {
  const { attributes } = useContext(RuntimeContext);
  const options = Object.keys(attributes).map(name => ({
    value: name,
    label: name,
  }));
  return (
    <>
      <Toggle
        className="AttributeExpressionForm__rerenderToggle"
        name="args.rerender"
        title="Rerender"
        formik={formik}
      />
      <SelectInput
        className="AttributeExpressionForm__attributes"
        name="args.attributeName"
        formik={formik}
        placeholder="Attribute Name"
        options={options}
        creatable
        valueOnly
      />
      <LiquidCodeEditor
        className="AttributeExpressionForm__expression"
        name="args.expression"
        placeholder="Attribute Expression"
        formik={formik}
      />
    </>
  );
};

AttributeExpressionActionEdit.propTypes = {
  formik: FormikShape.isRequired,
};

export default withAction(
  AttributeExpressionAction,
  ValidationSchema,
  InitialValues,
);
