import React from 'react';
import PropTypes from 'prop-types';

import './NewViewMenu.css';

const listItems = [{
  name: 'Button',
  description: ' - Intercepts touch events and sends an action message to a target object when it\'s tapped',
}, {
  name: 'Label',
  description: ' - A variably sized amount of static text',
}, {
  name: 'Image View',
  description: ' - Displays a single image, or an animation described by an array of images.',
}, {
  name: 'View',
  description: ' - Represents a rectangular region in which it draws and receives events',
}];

const NewViewMenu = props => (
  <div className="new-view-menu">
    <ul className="view-list">
      { listItems.map(viewInfo => (
        <li className="view-item">
          <span className="view-item__name">{viewInfo.name}</span>
          <span className="view-item__description">{viewInfo.description}</span>
        </li>
      )) }
    </ul>
  </div>
);

export default NewViewMenu;
