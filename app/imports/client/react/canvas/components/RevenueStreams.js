import PropTypes from 'prop-types';
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
import RevenueStreamAddModal from './RevenueStreamAddModal';
import { WithToggle } from '../../helpers';

const RevenueStreams = ({ organizationId }) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <CanvasSection>
        <CanvasSectionHeading>
          <h4>Revenue streams</h4>
          <RevenueStreamAddModal {...{ isOpen, toggle, organizationId }} />
          <CanvasAddButton onClick={toggle} />
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
    )}
  </WithToggle>
);

RevenueStreams.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default RevenueStreams;
