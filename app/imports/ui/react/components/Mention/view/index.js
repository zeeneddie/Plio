import React, { PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, Input } from 'reactstrap';

const MentionView = ({ users, value, onChange, onUserClick, isOpen, toggle, getInputRef }) => (
  <Dropdown {...{ isOpen, toggle }} className="dropup">
    <Input {...{ value, onChange }} getRef={getInputRef} placeholder="Add a comment" />
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
  </Dropdown>
);

MentionView.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  })),
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onUserClick: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  getInputRef: PropTypes.func,
};

export default MentionView;
