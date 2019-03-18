import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './TreeNode.scss';

const TreeNode = ({ text, isActive, isOnFocus, isLeaf, eventHandler }) => (
  <div
    className={cx('TreeNode', {
      'is-active': isActive,
      'is-onfocus': isOnFocus && !isActive,
    })}
    role="treeitem"
    tabIndex={0}
    onClick={() => !isActive && eventHandler('select')}
    onKeyPress={() => !isActive && eventHandler('select')}
    onMouseEnter={() => eventHandler('hoveron')}
    onMouseLeave={() => eventHandler('hoveroff')}
    onMouseDown={() => eventHandler('mousedown')}
    onMouseUp={() => eventHandler('mouseup')}
  >
    {isActive && !isLeaf ? (
      <button
        className="TreeNode__addButton"
        type="button"
        onClick={() => eventHandler('add')}
      >
        add
      </button>
    ) : (
      ''
    )}
    <div className="TreeNode__text">{text}</div>
  </div>
);

TreeNode.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isOnFocus: PropTypes.bool,
  isLeaf: PropTypes.bool,
  eventHandler: PropTypes.func,
};

TreeNode.defaultProps = {
  isActive: false,
  isOnFocus: false,
  isLeaf: false,
  eventHandler: () => {},
};

export default TreeNode;
