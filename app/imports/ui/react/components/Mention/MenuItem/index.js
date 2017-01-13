import React, { PropTypes } from 'react';

import MessageAvatar from '../../../discussion/components/MessageAvatar';
import { omitC } from '/imports/api/helpers';
import { keyMap } from '/imports/ui/constants';

class MentionMenuItem extends React.Component {
  componentDidMount() {
    if (this.props.focused) this.node.focus();
  }

  componentDidUpdate() {
    if (this.props.focused) this.node.focus();
  }

  render() {
    const { user, onUserSelect, ...other } = this.props;

    return (
      <a
        className="dropdown-item"
        href=""
        ref={node => (this.node = node)}
        onClick={e => onUserSelect && onUserSelect(e, user)}
        onKeyUp={e => e.keyCode === keyMap.enter && onUserSelect && onUserSelect(e, user)}
        {...omitC(['focused'], other)}
      >
        <MessageAvatar tag="div">
          <img src={user.avatar} alt={user.text} tabIndex="-1" />
        </MessageAvatar>
        <span>{user.text} </span>
        <span className="text-muted">{user.email}</span>
      </a>
    );
  }
}

MentionMenuItem.propTypes = {
  focused: PropTypes.bool,
  user: PropTypes.object.isRequired,
  onUserSelect: PropTypes.func.isRequired,
};

export default MentionMenuItem;
