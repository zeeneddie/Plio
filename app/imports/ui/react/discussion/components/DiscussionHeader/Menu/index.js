import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Icon } from '../../../../components/Icons';

const DiscussionHeaderMenu = ({
  isOpen, toggle, isMuted, onToggleMute,
}) => (
  <Dropdown {...{ isOpen, toggle }}>
    <DropdownToggle color="link">
      <Icon name="ellipsis-v" size={2} />
    </DropdownToggle>
    <DropdownMenu right>
      <DropdownItem onClick={onToggleMute}>
        {isMuted ? 'Enable notifications' : 'Disable notifications'}
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

DiscussionHeaderMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isMuted: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  onToggleMute: PropTypes.func,
};

export default DiscussionHeaderMenu;
