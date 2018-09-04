import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import Icon from '../../../../components/Icons/Icon';

const MessageMenu = ({
  pathToMessage, isAuthor, onDelete, isOpen, toggle,
}) => (
  <Dropdown className="chat-item-dropdown" {...{ isOpen, toggle }}>
    <DropdownToggle color="link">
      <Icon name="ellipsis-h" />
    </DropdownToggle>
    <DropdownMenu className="dropdown-menu-right">
      <DropdownItem className="js-message-copy-link" data-clipboard-text={pathToMessage}>
        Copy as link
      </DropdownItem>
      {isAuthor && (
        <DropdownItem onClick={onDelete}>
          Delete message
        </DropdownItem>
      )}
    </DropdownMenu>
  </Dropdown>
);

MessageMenu.propTypes = {
  pathToMessage: PropTypes.string,
  isAuthor: PropTypes.bool,
  onDelete: PropTypes.func,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default MessageMenu;
