import React, { PropTypes } from 'react';
import { DropdownMenu } from 'reactstrap';
import { compose, withState, withHandlers, defaultProps, lifecycle } from 'recompose';
import property from 'lodash.property';
import cx from 'classnames';

import MenuItem from '../MenuItem';
import { handleKeyDown } from './handlers';
import { omitProps } from '/imports/api/helpers';

// BUG: when menu is opened and user manually focuses
// input and types something the input loses focus

const enhance = compose(
  defaultProps({ focused: null }),
  withState('focused', 'setFocus', property('focused')),
  lifecycle({
    componentWillReceiveProps({ users, setFocus }) {
      if (this.props.users.length !== 0 && users.length === 0) setFocus(null);
    },
  }),
  withHandlers({ onKeyDown: handleKeyDown }),
  omitProps(['setFocus']),
);

const MentionMenu = enhance(({
  users,
  onUserSelect,
  onKeyDown,
  focused,
  className,
  Child = MenuItem,
  ...other
}) => (
  <DropdownMenu className={cx(className, 'dropdown-menu-full')} {...{ onKeyDown, ...other }}>
    {users.map((user, index) => (
      <Child key={user.value} focused={focused === index} {...{ user, onUserSelect }} />
    ))}
  </DropdownMenu>
));

MentionMenu.propTypes = {
  focused: PropTypes.number,
  onUserSelect: PropTypes.func,
  users: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  })),
  Child: PropTypes.func,
};

export default MentionMenu;
