import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionHelp from './CanvasSectionHelp';

const CustomerRelationships = () => (
  <CanvasSection empty>
    <CanvasSectionHeading>
      <h4>Customer relationships</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionHelp>
      <p>What type of relationship do you want with customers?</p>
      <p>Which fits best with each segment?</p>
    </CanvasSectionHelp>
  </CanvasSection>
);

export default CustomerRelationships;
