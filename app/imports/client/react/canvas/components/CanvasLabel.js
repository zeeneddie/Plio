import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  Button,
  Tooltip,
  ButtonGroup,
} from 'reactstrap';

import { WithToggle } from '../../helpers';

const StyledDropdownToggle = styled(DropdownToggle)`
  border-radius: .2rem !important;
`;

const StyledDropdownMenu = styled(DropdownMenu)`
  transform: none !important;
  top: auto !important;
  left: auto !important;
  min-width: 0;
  button.dropdown-item {
    padding: 10px;
    &:focus {
      outline: none;
    }
  }
`;

const StyledButton = styled(Button)`
  border-radius: .2rem !important;
`;

const CanvasLabel = ({
  children,
  label,
  tooltip,
  ...props
}) => {
  const id = `Tooltip-${label}`;

  return (
    <WithToggle>
      {({ isOpen, toggle }) => children ? (
        <ButtonDropdown
          direction="up"
          group={false}
          color="secondary"
          size="sm"
          {...{ ...props, isOpen, toggle }}
        >
          <StyledDropdownToggle>
            {label}
          </StyledDropdownToggle>
          <StyledDropdownMenu>
            {children}
          </StyledDropdownMenu>
        </ButtonDropdown>
      ) : (
        <ButtonGroup {...props}>
          <StyledButton color="secondary" size="sm" {...{ id }}>
            {label}
          </StyledButton>
          {tooltip && (
            <Tooltip placement="top" target={id} {...{ isOpen, toggle }}>
              {tooltip}
            </Tooltip>
          )}
        </ButtonGroup>
      )}
    </WithToggle>
  );
};

CanvasLabel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltip: PropTypes.string,
};

const StyledCanvasLabel = styled(CanvasLabel)`
  margin: 0 5px 4px 0;
  display: inline-block;

  & > button {
    padding: 0.1rem 0.3rem 0.15rem !important;
  }
`;

export default StyledCanvasLabel;
