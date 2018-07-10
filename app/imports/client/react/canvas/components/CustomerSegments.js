import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';

const CustomerSegments = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Customer segments</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>
          Pharmaceutical firms
          <CanvasLinkedItem>
            Novel drug molecule for age-related diseases
          </CanvasLinkedItem>
        </span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Biotechnology firms</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Genome diagnostic firms (23andme - licensing)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Mitochondrial disease clinicians</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
  </CanvasSection>
);

export default CustomerSegments;
