import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionHelp from './CanvasSectionHelp';

const KeyResources = () => (
  <CanvasSection empty>
    <CanvasSectionHeading>
      <h4>Key resources</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionHelp>
      <p>What key resources do our key activities require?</p>
    </CanvasSectionHelp>
  </CanvasSection>
);

export default KeyResources;
