// @flow
import type { AbstractComponent } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import type { ActionType } from './types';
import type { MutableListItemModeType } from '../../../../../components/MutableList';

import {
  MutableListItem,
  MutableListItemMode,
} from '../../../../../components/MutableList';

export type ActionContentProps = {
  id: string,
  mode: MutableListItemModeType,
  formik: {
    values: {
      args: any,
    },
    errors: {
      args: any,
    },
    setFieldValue: (string, any) => void,
  },
};

type ActionProps = {
  id: string,
  mode: MutableListItemModeType,
  data: ?ActionType,
  onSave: (id: string) => void,
  onDelete: (id: string) => void,
};

const withAction = (
  ActionComponent: AbstractComponent<ActionContentProps>,
  validationSchema: Yup.Schema<any, any>,
  defaultData: ActionType,
) => {
  const comp = (props: ActionProps) => {
    const { id, mode: initMode, data, onSave, onDelete } = props;
    const initData = data || defaultData;

    return (
      <Formik initialValues={initData} validationSchema={validationSchema}>
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
    mode: PropTypes.string,
    data: PropTypes.shape({
      type: PropTypes.string.isRequired,
      args: PropTypes.objectOf(PropTypes.any),
    }),
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
  };

  comp.defaultProps = {
    mode: MutableListItemMode.SUMMARY,
    data: null,
    onDelete: () => {},
    onSave: () => {},
  };
  return comp;
};

export default withAction;
