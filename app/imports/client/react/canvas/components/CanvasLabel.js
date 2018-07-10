import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ButtonDropdown, DropdownMenu, DropdownToggle, Button, Tooltip } from 'reactstrap';

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
}) => {
  const id = `Tooltip-${label}`;

  return (
    <WithToggle>
      {({ isOpen, toggle }) => children ? (
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
      ) : (
        <Fragment>
          <Button color="secondary" size="sm" {...{ ...props, id }}>
            {label}
          </Button>
          <Tooltip placement="top" target={id} {...{ isOpen, toggle }}>
            Hello World
          </Tooltip>
        </Fragment>
      )}
    </WithToggle>
  );
};

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
