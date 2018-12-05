import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CanvasReportHeader from './CanvasReportHeader';
import CanvasReportItemList from './CanvasReportItemList';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';

const ListWrapper = styled.div`
  column-count: 4;
`;

const CanvasReportItems = ({
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
      <CanvasReportHeader isEmpty={!keyPartners.length}>
        Key partners
      </CanvasReportHeader>
      <CanvasReportItemList items={keyPartners} />
      <CanvasReportHeader isEmpty={!keyActivities.length}>
        Key activities
      </CanvasReportHeader>
      <CanvasReportItemList items={keyActivities} />
      <CanvasReportHeader isEmpty={!keyResources.length}>
        Key resources
      </CanvasReportHeader>
      <CanvasReportItemList items={keyResources} />
      <CanvasReportHeader isEmpty={!valuePropositions.length}>
        Value propositions
      </CanvasReportHeader>
      <CanvasReportItemList items={valuePropositions} />
      <CanvasReportHeader isEmpty={!customerRelationships.length}>
        Customer relationships
      </CanvasReportHeader>
      <CanvasReportItemList items={customerRelationships} />
      <CanvasReportHeader isEmpty={!channels.length}>
        Channels
      </CanvasReportHeader>
      <CanvasReportItemList items={channels} />
      <CanvasReportHeader isEmpty={!customerSegments.length}>
        Customer segments
      </CanvasReportHeader>
      <CanvasReportItemList items={customerSegments} />
      <CanvasReportHeader isEmpty={!costLines.length}>
        Cost structure
      </CanvasReportHeader>
      <CanvasReportItemList items={costLines} />
      <CanvasReportHeader isEmpty={!revenueStreams.length}>
        Revenue streams
      </CanvasReportHeader>
      <CanvasReportItemList items={revenueStreams} />
    </ListWrapper>
  </CanvasReportSection>
);

CanvasReportItems.propTypes = {
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

export default CanvasReportItems;
