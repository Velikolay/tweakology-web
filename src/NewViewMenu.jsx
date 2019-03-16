import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Formik, Form, Field } from 'formik';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';

import './NewViewMenu.scss';

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

const NewViewMenu = ({ onNodeAdded }) => (
  <Formik
    initialValues={{ id: '', type: '' }}
    onSubmit={({ id, type }, { setSubmitting, resetForm }) => {
      onNodeAdded({ id, type, ...initProperties(id, type) });
      setSubmitting(false);
      resetForm();
    }}
  >
    {({ values: { id }, isSubmitting, setFieldValue }) => (
      <Form className="new-view-menu">
        <div className="view-id">
          <Field
            className="view-id__input"
            type="text"
            name="id"
            placeholder="Identifier"
          />
          <IconContext.Provider
            value={{ className: cx('view-id__icon', { 'is-disabled': !id }) }}
          >
            <FaPlusCircle />
          </IconContext.Provider>
        </div>
        <div className="view-list">
          {listItems.map(viewInfo => (
            <button
              className="view-item"
              type="submit"
              disabled={!id || isSubmitting}
              onClick={() => setFieldValue('type', viewInfo.type)}
            >
              <span className="view-item__name">{viewInfo.name}</span>
              <span className="view-item__description">
                {viewInfo.description}
              </span>
            </button>
          ))}
        </div>
      </Form>
    )}
  </Formik>
);

NewViewMenu.propTypes = {
  onNodeAdded: PropTypes.func.isRequired,
};

export default NewViewMenu;
