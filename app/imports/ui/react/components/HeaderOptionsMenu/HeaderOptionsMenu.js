import PropTypes from 'prop-types';
import React from 'react';

import Icon from '/imports/ui/react/components/Icons/Icon';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';

const HeaderOptionsMenu = props => (
  <Nav navbar className="pull-xs-right">
    <NavItem>
      <Dropdown isOpen={props.isOpen} toggle={props.setIsOpen}>
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
  setIsOpen: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default HeaderOptionsMenu;
