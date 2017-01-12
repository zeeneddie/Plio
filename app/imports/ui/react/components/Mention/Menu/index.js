import React, { PropTypes } from 'react';
import { DropdownMenu, DropdownItem } from 'reactstrap';

import MessageAvatar from '../../../discussion/components/MessageAvatar';

const MentionMenu = ({ users, onUserClick }) => (
  <DropdownMenu className="dropdown-menu-full" role="menu">
    {users.map((user) => (
      <DropdownItem
        href="#"
        key={user.value}
        tag="a"
        onClick={e => onUserClick(e, user)}
        onKeyPress={e => e.key === 'Enter' && onUserClick(e, user)}
      >
        <MessageAvatar tag="div" avatar={user.avatar} />
        <span>{user.text} </span>
        <span className="text-muted">{user.email}</span>
      </DropdownItem>
    ))}
  </DropdownMenu>
);

MentionMenu.propTypes = {
  onUserClick: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  })),
};

export default MentionMenu;
