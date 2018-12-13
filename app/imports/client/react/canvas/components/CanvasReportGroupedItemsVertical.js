import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CanvasReportHeader from './CanvasReportHeader';
import CanvasReportItemList from './CanvasReportItemList';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';

const ListWrapper = styled.div`
  column-count: 4;
  ol {
    list-style: decimal inside;
  }
`;

const CanvasReportGroupedItemsVertical = ({
  keyPartners,
  keyActivities,
  keyResources,
  valuePropositions,
  customerRelationships,
  channels,
  customerSegments,
  costLines,
  revenueStreams,
  itemsCount,
}) => (
  <CanvasReportSection>
    <CanvasReportSectionHeading>Canvas items ({itemsCount})</CanvasReportSectionHeading>
    <ListWrapper>
      <CanvasReportHeader tag="h3">Product/Market</CanvasReportHeader>
      <CanvasReportHeader isEmpty={!valuePropositions.length}>
        Value propositions
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={valuePropositions} />
      <CanvasReportHeader isEmpty={!customerSegments.length}>
        Customer segments
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={customerSegments} />

      <CanvasReportHeader tag="h3">Creating our value propositions</CanvasReportHeader>
      <CanvasReportHeader isEmpty={!keyPartners.length}>
        Key partners
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={keyPartners} />
      <CanvasReportHeader isEmpty={!keyActivities.length}>
        Key activities
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={keyActivities} />
      <CanvasReportHeader isEmpty={!keyResources.length}>
        Key resources
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={keyResources} />
      <CanvasReportHeader isEmpty={!costLines.length}>
        Cost structure
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={costLines} />

      <CanvasReportHeader tag="h3">Delivering our value propositions</CanvasReportHeader>
      <CanvasReportHeader isEmpty={!channels.length}>
        Channels
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={channels} />
      <CanvasReportHeader isEmpty={!customerRelationships.length}>
        Customer relationships
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={customerRelationships} />
      <CanvasReportHeader isEmpty={!revenueStreams.length}>
        Revenue streams
      </CanvasReportHeader>
      <CanvasReportItemList isSimple items={revenueStreams} />
    </ListWrapper>
  </CanvasReportSection>
);

CanvasReportGroupedItemsVertical.propTypes = {
  keyPartners: PropTypes.array.isRequired,
  keyActivities: PropTypes.array.isRequired,
  keyResources: PropTypes.array.isRequired,
  valuePropositions: PropTypes.array.isRequired,
  customerRelationships: PropTypes.array.isRequired,
  channels: PropTypes.array.isRequired,
  customerSegments: PropTypes.array.isRequired,
  costLines: PropTypes.array.isRequired,
  revenueStreams: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
};

export default CanvasReportGroupedItemsVertical;
