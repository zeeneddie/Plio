import PropTypes from 'prop-types';
import React from 'react';

import { EntityModalGuidance, GuidancePanel } from '../../components';
import GuidanceContainer from '../containers/GuidanceContainer';

const ModalGuidancePanel = ({ documentType, children }) => (
  <EntityModalGuidance>
    {({ isOpen, toggle }) => (
      <GuidancePanel {...{ isOpen, toggle }}>
        <div>{children}</div>
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
