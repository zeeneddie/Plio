import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Dropdown, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import { compose, withState, withHandlers, lifecycle } from 'recompose';

import { not } from '/imports/api/helpers';

const enhance = compose(
  withState('value', 'setValue', ''),
  withState('isOpen', 'setOpen', false),
  withHandlers({
    toggle: ({ setOpen }) => setOpen(not),
  }),
  lifecycle({
    componentWillReceiveProps({ value, setOpen }) {
      if (this.props.value === value) return;

      if (value) setOpen(true);
      else setOpen(false);
    },
  }),
);

const Mention = enhance(({ value, setValue, isOpen, toggle }) => (
  <Dropdown {...{ isOpen, toggle }}>
    <Input {...{ value }} onChange={e => setValue(e.target.value)} />
    <DropdownMenu className="dropdown-menu-full">
      {Meteor.users.find().map((user) => (
        <DropdownItem
          key={user._id}
          tag="a"
        >
          <span>{user.fullName()}</span>
        </DropdownItem>
      ))}
    </DropdownMenu>
  </Dropdown>
));

Mention.propTypes = {

};

export default Mention;
