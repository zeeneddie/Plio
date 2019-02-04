import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { EntityModalGuidance, GuidancePanel } from '../../components';
import GuidanceContainer from '../containers/GuidanceContainer';

const StyledChildren = styled.div`
  p { 
    margin: 0;
  }
`;

const ModalGuidancePanel = ({ documentType, children }) => (
  <EntityModalGuidance>
    {({ isOpen, toggle }) => (
      <GuidancePanel {...{ isOpen, toggle }}>
        <StyledChildren>{children}</StyledChildren>
        <GuidanceContainer
          {...{ documentType }}
          skip={!isOpen}
        />
      </GuidancePanel>
    )}
  </EntityModalGuidance>
);

ModalGuidancePanel.propTypes = {
  documentType: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ModalGuidancePanel;
