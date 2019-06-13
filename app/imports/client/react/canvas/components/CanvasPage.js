import PropTypes from 'prop-types';
import React from 'react';

import Canvas from './Canvas';
import CanvasRow from './CanvasRow';
import CanvasCol from './CanvasCol';
import KeyPartners from './KeyPartners';
import KeyActivities from './KeyActivities';
import KeyResources from './KeyResources';
import ValuePropositions from './ValuePropositions';
import CustomerRelationships from './CustomerRelationships';
import Channels from './Channels';
import CustomerSegments from './CustomerSegments';
import CostStructure from './CostStructure';
import RevenueStreams from './RevenueStreams';

const CanvasPage = ({ organizationId }) => (
  <div className="content scroll">
    <Canvas>
      <CanvasRow twoThirds>
        <CanvasCol md>
          <KeyPartners {...{ organizationId }} />
        </CanvasCol>
        <CanvasCol md>
          <KeyActivities {...{ organizationId }} />
          <KeyResources {...{ organizationId }} />
        </CanvasCol>
        <CanvasCol md>
          <ValuePropositions {...{ organizationId }} />
        </CanvasCol>
        <CanvasCol md>
          <CustomerRelationships {...{ organizationId }} />
          <Channels {...{ organizationId }} />
        </CanvasCol>
        <CanvasCol md>
          <CustomerSegments {...{ organizationId }} />
        </CanvasCol>
      </CanvasRow>
      <CanvasRow oneThird>
        <CanvasCol sm>
          <CostStructure {...{ organizationId }} />
        </CanvasCol>
        <CanvasCol sm>
          <RevenueStreams {...{ organizationId }} />
        </CanvasCol>
      </CanvasRow>
    </Canvas>
  </div>
);

CanvasPage.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default CanvasPage;
