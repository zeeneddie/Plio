import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { ButtonDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import { WithToggle } from '../../helpers';

const StyledDropdownMenu = styled(DropdownMenu)`
  transform: none !important;
  top: auto !important;
  left: auto !important;
`;

const CanvasLabel = ({
  children,
  label,
  ...props
}) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <ButtonDropdown
        dropup
        group={false}
        color="secondary"
        size="sm"
        {...{ ...props, isOpen, toggle }}
      >
        <DropdownToggle>
          {label}
        </DropdownToggle>
        <StyledDropdownMenu>
          {children}
        </StyledDropdownMenu>
      </ButtonDropdown>
    )}
  </WithToggle>
);

CanvasLabel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const StyledCanvasLabel = styled(CanvasLabel)`
  margin: 0 5px 4px 0;
  display: inline-block;

  & > button {
    padding: 0.1rem 0.7rem 0.15rem !important;
  }
`;

export default StyledCanvasLabel;
