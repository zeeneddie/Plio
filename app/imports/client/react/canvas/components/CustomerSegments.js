import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasChartButton from './CanvasChartButton';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
// import CanvasSectionHelp from './CanvasSectionHelp';

const CustomerSegments = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Customer segments</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    {/* <CanvasSectionHelp>
      <p>For whom are we creating value?</p>
      <p>Who are our most important customers?</p>
    </CanvasSectionHelp> */}
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>
          Pharmaceutical firms
          <CanvasLinkedItem>
            <span>Novel drug molecule for age-related diseases</span>
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
    <CanvasSectionFooter>
      <CanvasSectionFooterLabels />
      <CanvasChartButton icon="pie-chart" />
    </CanvasSectionFooter>
  </CanvasSection>
);

export default CustomerSegments;
