import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionHelp from './CanvasSectionHelp';

const Channels = () => (
  <CanvasSection empty>
    <CanvasSectionHeading>
      <h4>Channels</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionHelp>
      <p>Through which channels do each of our segments want to be reached?</p>
      <p>Which ones are most cost-efficient?</p>
    </CanvasSectionHelp>
  </CanvasSection>
);

export default Channels;
