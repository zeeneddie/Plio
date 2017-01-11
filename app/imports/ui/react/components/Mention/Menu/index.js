import React, { PropTypes } from 'react';
import { DropdownMenu, DropdownItem } from 'reactstrap';

const MentionMenu = ({ users, onUserClick }) => (
  <DropdownMenu className="dropdown-menu-full">
    {users.map((user) => (
      <DropdownItem
        key={user.value}
        tag="a"
        onClick={e => onUserClick(e, user)}
      >
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
