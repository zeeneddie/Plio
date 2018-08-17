import PropTypes from 'prop-types';
import React from 'react';
import { Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import Icon from '../Icons/Icon';

const HeaderOptionsMenu = props => (
  <Nav navbar className="pull-xs-right nav">
    <NavItem>
      <Dropdown isOpen={props.isOpen} toggle={props.toggle}>
        <DropdownToggle tag={NavLink}>
          <Icon name="ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu right>
          {props.children}
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  </Nav>
);

HeaderOptionsMenu.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default HeaderOptionsMenu;
