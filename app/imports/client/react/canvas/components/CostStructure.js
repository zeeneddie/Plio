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
      <p>
        What are the main elements of operational expense
        {' '}
        (including variable costs, inventory, WIP and capital assets)?
      </p>
    </CanvasSectionHelp> */}
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Staff costs (R&D, operational)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Outsourced contract research</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Outsourced DNA sequencing</span>
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
