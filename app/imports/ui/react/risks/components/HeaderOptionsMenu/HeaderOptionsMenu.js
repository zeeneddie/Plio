import React, { PropTypes } from 'react';
import { withState } from 'recompose';

import Icon from '/imports/ui/react/components/Icon';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import NavLink from 'reactstrap/lib/NavLink';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';

const enhance = withState('isOpen', 'setIsOpen', false);
const HeaderOptionsMenu = (props) => (
  <Nav navbar className="pull-xs-right">
    <NavItem>
      <Dropdown isOpen={props.isOpen} toggle={props.setIsOpen}>
        <DropdownToggle tag={NavLink}>
          <Icon names="ellipsis-v" />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem onClick={props.onHandleDataExport}>
            Export Data
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  </Nav>
);

HeaderOptionsMenu.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func.isRequired,
  onHandleDataExport: PropTypes.func.isRequired,
};

export default enhance(HeaderOptionsMenu);
