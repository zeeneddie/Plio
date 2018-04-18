import PropTypes from 'prop-types';
import React from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import styled from 'styled-components';

import Collapse from './Collapse';
import CardBlock from './CardBlock';

const StyledButton = styled(Button)`
  padding-left: 0;
`;

const GuidancePanel = ({
  isOpen,
  toggle,
  children,
  ...props
}) => (
  <Collapse {...{ isOpen, ...props }}>
    <CardBlock>
      <div>{children}</div>
      <ButtonGroup>
        <StyledButton
          color="link"
          onClick={toggle}
        >
          Close
        </StyledButton>
      </ButtonGroup>
    </CardBlock>
  </Collapse>
);

GuidancePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default GuidancePanel;
