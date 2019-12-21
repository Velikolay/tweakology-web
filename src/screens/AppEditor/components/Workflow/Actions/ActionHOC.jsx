// @flow
import type { AbstractComponent } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import MutableListItem, {
  ItemMode,
} from '../../../../../components/MutableList/MutableListItem';

export type ActionContentProps = {
  id: string,
  mode: Symbol,
  formik: {
    values: any,
    errors: any,
    setFieldValue: (string, any) => void,
  },
};

type ActionProps = {
  id: string,
  mode: Symbol,
  values?: any,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

const withAction = (
  ActionComponent: AbstractComponent<ActionContentProps>,
  validationSchema: Yup.Schema<any, any>,
  defaultValues: any,
) => {
  const comp = (props: ActionProps) => {
    const {
      id,
      mode: initMode,
      values: customValues,
      onSave,
      onDelete,
    } = props;
    const initValues = customValues || defaultValues;

    return (
      <Formik initialValues={initValues} validationSchema={validationSchema}>
        {formik => (
          <MutableListItem
            id={id}
            mode={initMode}
            formik={formik}
            autosave={false}
            onSave={onSave}
            onDelete={onDelete}
          >
            {(_, mode) => (
              <ActionComponent id={id} mode={mode} formik={formik} />
            )}
          </MutableListItem>
        )}
      </Formik>
    );
  };
  comp.propTypes = {
    id: PropTypes.string.isRequired,
    mode: PropTypes.symbol,
    values: PropTypes.objectOf(PropTypes.any),
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
  };

  comp.defaultProps = {
    mode: ItemMode.SUMMARY,
    values: null,
    onDelete: () => {},
    onSave: () => {},
  };
  return comp;
};

export default withAction;
