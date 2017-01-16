import React, { PropTypes } from 'react';

import DropdownMenu from '../../DropdownMenu';
import MessageAvatar from '../../../discussion/components/MessageAvatar';

const MentionMenu = ({
  users,
  onUserSelect,
  ...other
}) => (
  <DropdownMenu {...other}>
    {users.map((user) => (
      <DropdownMenu.Item key={user.value} onMouseDown={e => onUserSelect && onUserSelect(e, user)}>
        <MessageAvatar tag="div">
          <img src={user.avatar} alt={user.text} tabIndex="-1" />
        </MessageAvatar>
        <span>{user.text} </span>
        <span className="text-muted">{user.email}</span>
      </DropdownMenu.Item>
    ))}
  </DropdownMenu>
);

MentionMenu.propTypes = {
  onUserSelect: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  })),
};

export default MentionMenu;
