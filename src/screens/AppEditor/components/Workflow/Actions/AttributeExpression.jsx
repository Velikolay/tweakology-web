// @flow
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { IconContext } from 'react-icons';
import { FaCode } from 'react-icons/fa';

import type { ActionContentProps } from './ActionHOC';
import withAction from './ActionHOC';

import Toggle from '../../../../../components/InputFields/Toggle';
import { FormikSelectInput } from '../../../../../components/InputFields/SelectInput';
import TextArea from '../../../../../components/InputFields/TextArea';
import { ItemMode } from '../../../../../components/MutableList/MutableListItem';

import RuntimeContext from '../../../contexts/RuntimeContext';

import './AttributeExpression.scss';

type AttributeExpressionActionState = {
  rerender: boolean,
  attributes: { value: string, label: string }[],
  attributeExpression: string,
};

type AttributeExpressionActionFormik = {
  formik: {
    values: AttributeExpressionActionState,
    errors: {
      rerender: string,
      attributes: string,
      attributeExpression: string,
    },
    setFieldValue: (string, any) => void,
  },
};

const InitialValues = {
  rerender: false,
  attributes: [],
  attributeExpression: '',
};

const ValidationSchema = Yup.object().shape({
  rerender: Yup.boolean().required('Required'),
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
  return mode === ItemMode.SUMMARY ? (
    <AttributeExpressionActionSummary {...values} />
  ) : (
    <AttributeExpressionActionEdit formik={formik} />
  );
};

const FormikShape = PropTypes.shape({
  values: PropTypes.shape({
    rerender: PropTypes.bool.isRequired,
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ).isRequired,
    attributeExpression: PropTypes.string.isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    rerender: PropTypes.string,
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
  rerender,
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
        name="rerender"
        title="Rerender"
        formik={formik}
      />
      <FormikSelectInput
        className="AttributeExpressionForm__attributes"
        name="attributes"
        placeholder="Attribute Name"
        options={options}
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
