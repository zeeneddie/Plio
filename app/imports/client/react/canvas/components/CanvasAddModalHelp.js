import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';
import { GuidanceIcon, CardBlock } from '../../components';
import { Consumer } from '../../components/EntityModalNext/EntityModal';

const StyledCardBlock = styled(CardBlock)`
  display: flex;
`;

const StyledHelp = styled.div`
  p { 
    margin: 0;
  }
`;

const StyledGuidanceIcon = styled(GuidanceIcon)`
  width: 31px;
  padding: 0;
  margin-right: 1.25rem;
  i {
    color: ${Styles.color.blue}
  }
`;

const CanvasAddModalHelp = ({ children }) => (
  <Consumer>
    {({
      state: { isGuidanceOpen },
      toggleGuidance,
    }) => (
      <StyledCardBlock>
        <StyledGuidanceIcon
          persist
          color="primery"
          isOpen={isGuidanceOpen}
          onClick={toggleGuidance}
        />
        <StyledHelp>{children}</StyledHelp>
      </StyledCardBlock>
    )}
  </Consumer>
);

CanvasAddModalHelp.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CanvasAddModalHelp;
