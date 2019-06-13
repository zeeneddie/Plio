import React from 'react';
import styled from 'styled-components';
import Blaze from 'meteor/gadicc:blaze-react-component';
import PropTypes from 'prop-types';
import { Navbar } from 'reactstrap';
import { StyledMixins } from 'plio-util';

import { Styles } from '../../../../api/constants';
import OrganizationMenu from './OrganizationMenu';

const NavbarStyled = styled(Navbar)`
  display: flex;
  .navbar-nav {
    margin: 0;
    padding: 0;
    height: 50px;
    .dropdown {
      height: 50px;
    }
    .dropdown-toggle {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      &:after {
        font-size: 18px;
      }
      &:hover {
        &:after, .secondary-label {
          color: ${Styles.color.hoverLightBlue};
        }
      }
    }
  }
  .secondary-label, .dropdown-toggle:after {
    transition: color 0.4s ease;
    color: ${Styles.color.lightBlue};
  }
`;

const UserMenuWrapper = styled.div`
  ${StyledMixins.media.mobile`
    .nav-item.open {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      background: #444;
      & > .nav-link {
        float: right;
        & > span {
          display: block;
          float: left;
        }
      }
    }
    .nav-link > span {
      display: none;
    }
  `}
`;

const MainHeader = ({ organization, isDashboard }) => (
  <NavbarStyled dark>
    <OrganizationMenu {...{ organization, isDashboard }} />
    <UserMenuWrapper>
      <Blaze
        template="UserMenu"
        // Blaze component renders <span> tag and messes up styling
        className="nav navbar-nav pull-xs-right"
        organizationId={organization._id}
        organizationName={organization.name}
      />
    </UserMenuWrapper>
  </NavbarStyled>
);

MainHeader.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isDashboard: PropTypes.bool,
};

export default MainHeader;
