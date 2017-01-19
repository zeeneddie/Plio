import React, { PropTypes } from 'react';

import DropdownMenu from '../../DropdownMenu';
import Message from '../../../discussion/components/Message';

const MentionMenu = ({
  users,
  onUserSelect,
  ...other
}) => (
  <DropdownMenu {...other}>
    {users.map((user) => (
      <DropdownMenu.Item key={user.value} onMouseDown={e => onUserSelect && onUserSelect(e, user)}>
        <Message.Avatar tag="div">
          <img src={user.avatar} alt={user.text} tabIndex="-1" />
        </Message.Avatar>
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
