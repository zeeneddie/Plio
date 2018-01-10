import PropTypes from 'prop-types';
import React from 'react';
import { DropdownMenu, DropdownItem } from 'reactstrap';
import cx from 'classnames';

import Message from '../../../discussion/components/Message';
import { KeyMap } from '../../../../../api/constants';

const MentionMenu = ({
  users,
  onUserSelect,
  className,
  ...other
}) => (
  <DropdownMenu
    className={cx('dropdown-menu-full', className)}
    {...other}
  >
    {users.map(user => (
      <DropdownItem
        key={user.value}
        onMouseDown={e => onUserSelect && onUserSelect(e, user)}
        onKeyPress={e => e.which === KeyMap.enter && onUserSelect && onUserSelect(e, user)}
      >
        <Message.Avatar tag="div">
          <img src={user.avatar} alt={user.text} tabIndex="-1" />
        </Message.Avatar>
        <span>{user.text} </span>
        <span className="text-muted">{user.email}</span>
      </DropdownItem>
    ))}
  </DropdownMenu>
);

MentionMenu.propTypes = {
  className: PropTypes.string,
  onUserSelect: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  })),
};

export default MentionMenu;
