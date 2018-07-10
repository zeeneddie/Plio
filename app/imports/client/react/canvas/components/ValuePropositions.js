import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';

const ValuePropositions = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Value propositions</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Compassionate drug use (rare mitochondrial diseases)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Novel drug molecule for age-related diseases</span>
        <CanvasLinkedItem>
          Pharmaceutical firms
        </CanvasLinkedItem>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Novel mitochondrial diagnostic test (to use with drug or independently)</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
  </CanvasSection>
);

export default ValuePropositions;