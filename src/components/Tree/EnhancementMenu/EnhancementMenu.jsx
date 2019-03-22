import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Formik, Form, Field } from 'formik';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';

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

const listItems = [
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

const initProperties = (id, type) => {
  const item = listItems.find(el => el.type === type);
  return item.init(id);
};

const EnhancementMenu = ({ onItemAdded }) => (
  <Formik
    initialValues={{ id: '', type: '' }}
    onSubmit={({ id, type }, { setSubmitting, resetForm }) => {
      onItemAdded({ id, type, ...initProperties(id, type) });
      setSubmitting(false);
      resetForm();
    }}
  >
    {({ values: { id }, isSubmitting, setFieldValue }) => (
      <Form className="TreeEnhancementMenu">
        <div className="TreeEnhancementMenu__itemId">
          <Field
            className="TreeEnhancementMenu__itemId__input"
            type="text"
            name="id"
            placeholder="Identifier"
          />
          <IconContext.Provider
            value={{
              className: cx('TreeEnhancementMenu__itemId__icon', {
                disabled: !id,
              }),
            }}
          >
            <FaPlusCircle />
          </IconContext.Provider>
        </div>
        <div className="TreeEnhancementMenu__itemList">
          {listItems.map(viewInfo => (
            <button
              className="TreeEnhancementMenu__item"
              key={viewInfo.type}
              type="submit"
              disabled={!id || isSubmitting}
              onClick={() => setFieldValue('type', viewInfo.type)}
            >
              <span className="TreeEnhancementMenu__item__name">
                {viewInfo.name}
              </span>
              <span className="TreeEnhancementMenu__item__description">
                {viewInfo.description}
              </span>
            </button>
          ))}
        </div>
      </Form>
    )}
  </Formik>
);

EnhancementMenu.propTypes = {
  onItemAdded: PropTypes.func.isRequired,
};

export default EnhancementMenu;
