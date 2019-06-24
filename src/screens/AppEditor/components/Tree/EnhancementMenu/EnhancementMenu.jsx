import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';

import {
  viewCatalogue,
  layoutCatalogue,
  combinedCatalogue,
} from '../../../../../services/device/metadata';
import TabBar, { Tab } from '../../../../../components/TabBar';

import './EnhancementMenu.scss';

const itemListDOM = (items, { disabled, setFieldValue }) => (
  <div className="TreeEnhancementMenu__itemList">
    {Object.values(items).map(item => (
      <button
        className="TreeEnhancementMenu__item"
        key={item.type}
        type="submit"
        disabled={disabled}
        onClick={() => setFieldValue('type', item.type)}
      >
        <span className="TreeEnhancementMenu__item__name">{item.name}</span>
        <span className="TreeEnhancementMenu__item__description">
          {` - ${item.description}`}
        </span>
      </button>
    ))}
  </div>
);

const ValidationSchema = Yup.object().shape({
  id: Yup.string()
    .max(30, 'Identifier too long')
    .required('Identifier required'),
});

const EnhancementMenu = ({ eventHandler }) => (
  <Formik
    initialValues={{ id: '', type: '' }}
    validationSchema={ValidationSchema}
    onSubmit={({ id, type }, { setSubmitting, resetForm }) => {
      eventHandler('additem', {
        id,
        type,
        ...combinedCatalogue[type].init(id),
      });
      setSubmitting(false);
      resetForm();
    }}
  >
    {({ errors, isSubmitting, setFieldValue }) => (
      <Form className="TreeEnhancementMenu">
        <div
          className={cx('TreeEnhancementMenu__itemId', {
            error: !!errors.id,
          })}
        >
          <Field
            className="TreeEnhancementMenu__itemId__input"
            type="text"
            name="id"
            placeholder="Identifier"
          />
          <IconContext.Provider
            value={{
              className: cx('TreeEnhancementMenu__itemId__icon', {
                error: !!errors.id,
              }),
            }}
          >
            <FaPlusCircle />
          </IconContext.Provider>
        </div>
        <TabBar>
          <Tab id="views" title="Views">
            {itemListDOM(viewCatalogue, {
              disabled: isSubmitting,
              setFieldValue,
            })}
          </Tab>
          <Tab id="layout" title="Layout">
            {itemListDOM(layoutCatalogue, {
              disabled: isSubmitting,
              setFieldValue,
            })}
          </Tab>
        </TabBar>
      </Form>
    )}
  </Formik>
);

EnhancementMenu.propTypes = {
  eventHandler: PropTypes.func.isRequired,
};

export default EnhancementMenu;
