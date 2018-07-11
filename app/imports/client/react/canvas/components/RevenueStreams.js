import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasChartButton from './CanvasChartButton';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
// import CanvasSectionHelp from './CanvasSectionHelp';

const ValuePropositions = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Cost structure</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    {/* <CanvasSectionHelp>
      <p>From which channels and segments?</p>
      <p>How much does each contribute to overall revenue?</p>
    </CanvasSectionHelp> */}
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Diagnostic IP licensing fees (early stage)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Drug target IP licensing fees (early stage)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Compassionate use drug revenue (mid stage)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Patenting costs</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
    <CanvasSectionFooter>
      <CanvasSectionFooterLabels />
      <CanvasChartButton icon="pie-chart" />
    </CanvasSectionFooter>
  </CanvasSection>
);

export default ValuePropositions;
