import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';

import TabMenu, { Tab } from '../../../containers/TabMenu';

import './EnhancementMenu.scss';

const initFrame = id => ({
  x: 0,
  y: 0,
  height: 50,
  width: id ? id.length * 10 + 16 : 80,
});

const backgroundColor = {
  alpha: 1,
  hexValue: '#ffffff',
};

const textColor = {
  alpha: 1,
  hexValue: '#000000',
};

const font = {
  familyName: 'System',
  fontStyle: 'Regular',
  pointSize: 14,
};

const LAYOUT_ITEMS = [
  {
    type: 'NSLayoutConstraint',
    name: 'Constraint',
    description:
      ' - The relationship between two user interface objects that must be satisfied by the constraint-based layout system',
    init: () => ({}),
  },
];

const VIEW_ITEMS = [
  {
    type: 'UIButton',
    name: 'Button',
    description:
      " - Intercepts touch events and sends an action message to a target object when it's tapped",
    init: id => ({
      frame: initFrame(id),
      properties: {
        backgroundColor,
        title: {
          text: id,
          textColor,
          font,
        },
      },
    }),
  },
  {
    type: 'UILabel',
    name: 'Label',
    description: ' - A variably sized amount of static text',
    init: id => ({
      frame: initFrame(id),
      properties: {
        text: id,
        textColor,
        textAlignment: 1,
        font,
        backgroundColor,
      },
    }),
  },
  {
    type: 'UIImageView',
    name: 'Image View',
    description:
      ' - Displays a single image, or an animation described by an array of images.',
    init: id => ({
      frame: initFrame(),
      properties: {
        image: {
          src: 'EmptyImage',
        },
      },
    }),
  },
  {
    type: 'UIView',
    name: 'View',
    description:
      ' - Represents a rectangular region in which it draws and receives events',
    init: id => ({
      frame: initFrame(),
      properties: {
        backgroundColor,
      },
    }),
  },
];

const initProperties = (items, id, type) => {
  const item = items.find(el => el.type === type);
  return item.init(id);
};

const itemListDOM = (items, { isSubmitting, setFieldValue }) => (
  <div className="TreeEnhancementMenu__itemList">
    {items.map(item => (
      <button
        className="TreeEnhancementMenu__item"
        key={item.type}
        type="submit"
        disabled={isSubmitting}
        onClick={() => setFieldValue('type', item.type)}
      >
        <span className="TreeEnhancementMenu__item__name">{item.name}</span>
        <span className="TreeEnhancementMenu__item__description">
          {item.description}
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

const EnhancementMenu = ({ onItemAdded }) => (
  <Formik
    initialValues={{ id: '', type: '' }}
    validationSchema={ValidationSchema}
    onSubmit={({ id, type }, { setSubmitting, resetForm }) => {
      onItemAdded({ id, type, ...initProperties(VIEW_ITEMS, id, type) });
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
        <TabMenu>
          <Tab name="Views">
            {itemListDOM(VIEW_ITEMS, { isSubmitting, setFieldValue })}
          </Tab>
          <Tab name="Layout">
            {itemListDOM(LAYOUT_ITEMS, { isSubmitting, setFieldValue })}
          </Tab>
        </TabMenu>
      </Form>
    )}
  </Formik>
);

EnhancementMenu.propTypes = {
  onItemAdded: PropTypes.func.isRequired,
};

export default EnhancementMenu;
