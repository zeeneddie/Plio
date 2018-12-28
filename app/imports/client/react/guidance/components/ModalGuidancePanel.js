import PropTypes from 'prop-types';
import React from 'react';

import { EntityModalGuidance, GuidancePanel } from '../../components';
import GuidanceContainer from '../containers/GuidanceContainer';

const ModalGuidancePanel = ({ documentType }) => (
  <EntityModalGuidance>
    {({ isOpen, toggle }) => (
      <GuidancePanel {...{ isOpen, toggle }}>
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
};

export default ModalGuidancePanel;
