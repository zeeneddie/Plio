import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, isEmpty } from 'ramda';
import { concatAll } from 'plio-util';

import CanvasReportHeader from './CanvasReportHeader';
import CanvasReportItemList from './CanvasReportItemList';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';

const ListWrapper = styled.div`
  h4 {
    margin: 0;
  }
  ol {
    list-style: none;
    li {
      display: inline-flex;
      margin-right: 12px;
    }
  }
`;

const isGroupEmpty = compose(
  isEmpty,
  concatAll,
);

const CanvasReportGroupedItemsHorizontal = ({
  keyPartners,
  keyActivities,
  valuePropositions,
  customerSegments,
  costLines,
  revenueStreams,
  keyResources,
  channels,
  customerRelationships,
  itemsCount,
}) => !!itemsCount && (
  <CanvasReportSection>
    <CanvasReportSectionHeading>Canvas items ({itemsCount})</CanvasReportSectionHeading>
    <ListWrapper>
      <CanvasReportHeader isEmpty={isGroupEmpty([valuePropositions, customerSegments])} tag="h3">
        Product/Market
      </CanvasReportHeader>
      {!!customerSegments.length && (
        <Fragment>
          <CanvasReportHeader>Customer segments</CanvasReportHeader>
          <CanvasReportItemList isSimple items={customerSegments} />
        </Fragment>
      )}
      {!!valuePropositions.length && (
        <Fragment>
          <CanvasReportHeader>Value propositions</CanvasReportHeader>
          <CanvasReportItemList isSimple items={valuePropositions} />
        </Fragment>
      )}

      <CanvasReportHeader
        tag="h3"
        isEmpty={isGroupEmpty([
          keyPartners,
          keyActivities,
          keyResources,
          costLines,
        ])}
      >
        Creating our value propositions
      </CanvasReportHeader>
      {!!keyActivities.length && (
        <Fragment>
          <CanvasReportHeader>Key activities</CanvasReportHeader>
          <CanvasReportItemList isSimple items={keyActivities} />
        </Fragment>
      )}
      {!!keyPartners.length && (
        <Fragment>
          <CanvasReportHeader>Key partners</CanvasReportHeader>
          <CanvasReportItemList isSimple items={keyPartners} />
        </Fragment>
      )}
      {!!keyResources.length && (
        <Fragment>
          <CanvasReportHeader>Key resources</CanvasReportHeader>
          <CanvasReportItemList isSimple items={keyResources} />
        </Fragment>
      )}
      {!!costLines.length && (
        <Fragment>
          <CanvasReportHeader>Cost structure</CanvasReportHeader>
          <CanvasReportItemList isSimple items={costLines} />
        </Fragment>
      )}

      <CanvasReportHeader
        tag="h3"
        isEmpty={isGroupEmpty([channels, customerRelationships, revenueStreams])}
      >
        Delivering our value propositions
      </CanvasReportHeader>
      {!!channels.length && (
        <Fragment>
          <CanvasReportHeader>Channels</CanvasReportHeader>
          <CanvasReportItemList isSimple items={channels} />
        </Fragment>
      )}
      {!!customerRelationships.length && (
        <Fragment>
          <CanvasReportHeader>Customer relationships</CanvasReportHeader>
          <CanvasReportItemList isSimple items={customerRelationships} />
        </Fragment>
      )}
      {!!revenueStreams.length && (
        <Fragment>
          <CanvasReportHeader>Revenue streams</CanvasReportHeader>
          <CanvasReportItemList isSimple items={revenueStreams} />
        </Fragment>
      )}
    </ListWrapper>
  </CanvasReportSection>
);

CanvasReportGroupedItemsHorizontal.propTypes = {
  keyPartners: PropTypes.array.isRequired,
  keyActivities: PropTypes.array.isRequired,
  valuePropositions: PropTypes.array.isRequired,
  customerSegments: PropTypes.array.isRequired,
  costLines: PropTypes.array.isRequired,
  revenueStreams: PropTypes.array.isRequired,
  itemsCount: PropTypes.number.isRequired,
  keyResources: PropTypes.array.isRequired,
  channels: PropTypes.array.isRequired,
  customerRelationships: PropTypes.array.isRequired,
};

export default CanvasReportGroupedItemsHorizontal;
