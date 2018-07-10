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

const CanvasPage = () => (
  <Canvas>
    <CanvasRow twoThirds>
      <CanvasCol md>
        <KeyPartners />
      </CanvasCol>
      <CanvasCol md>
        <KeyActivities />
        <KeyResources />
      </CanvasCol>
      <CanvasCol md>
        <ValuePropositions />
      </CanvasCol>
      <CanvasCol md>
        <CustomerRelationships />
        <Channels />
      </CanvasCol>
      <CanvasCol md>
        <CustomerSegments />
      </CanvasCol>
    </CanvasRow>
    <CanvasRow oneThird>
      <CanvasCol sm>Hello World</CanvasCol>
      <CanvasCol sm>Hello World</CanvasCol>
    </CanvasRow>
  </Canvas>
);

export default CanvasPage;
