import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Formik, Form, Field } from 'formik';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';

import './NewViewMenu.css';

const listItems = [{
  type: 'UIButton',
  name: 'Button',
  description: ' - Intercepts touch events and sends an action message to a target object when it\'s tapped',
}, {
  type: 'UILabel',
  name: 'Label',
  description: ' - A variably sized amount of static text',
}, {
  type: 'UIImageView',
  name: 'Image View',
  description: ' - Displays a single image, or an animation described by an array of images.',
}, {
  type: 'UIView',
  name: 'View',
  description: ' - Represents a rectangular region in which it draws and receives events',
}];

const NewViewMenu = props => (
  <Formik
    initialValues={{ identifier: '', viewType: '' }}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    }}
  >
    {({ values: { identifier }, isSubmitting, setFieldValue }) => (
      <Form className="new-view-menu">
        <div className="view-id">
          <Field className="view-id__input" type="text" name="identifier" placeholder="Identifier" />
          <IconContext.Provider value={{ className: cx('view-id__icon', { 'is-disabled': !identifier }) }}>
            <FaPlusCircle />
          </IconContext.Provider>
        </div>
        <div className="view-list">
          { listItems.map(viewInfo => (
            <button
              className="view-item"
              type="submit"
              disabled={!identifier || isSubmitting}
              onClick={() => setFieldValue('viewType', viewInfo.type)}
            >
              <span className="view-item__name">{viewInfo.name}</span>
              <span className="view-item__description">{viewInfo.description}</span>
            </button>
          )) }
        </div>
      </Form>
    )}
  </Formik>
);

export default NewViewMenu;
