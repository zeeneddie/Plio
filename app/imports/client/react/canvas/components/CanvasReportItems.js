import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, isEmpty, sort } from 'ramda';
import { concatAll, byTitle } from 'plio-util';

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
    break-inside: avoid;
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

const sortByTitle = sort(byTitle);

const CanvasReportItems = ({
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
  <CanvasReportSection className="canvas-items">
    <CanvasReportSectionHeading>Canvas items ({itemsCount})</CanvasReportSectionHeading>
    <ListWrapper>
      <CanvasReportHeader isEmpty={isGroupEmpty([valuePropositions, customerSegments])} tag="h3">
        Product/Market
      </CanvasReportHeader>
      {!!customerSegments.length && (
        <Fragment>
          <CanvasReportHeader>Customer segments</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={customerSegments} />
        </Fragment>
      )}
      {!!valuePropositions.length && (
        <Fragment>
          <CanvasReportHeader>Value propositions</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={valuePropositions} />
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
          <CanvasReportItemList isSimple sort={sortByTitle} items={keyActivities} />
        </Fragment>
      )}
      {!!keyPartners.length && (
        <Fragment>
          <CanvasReportHeader>Key partners</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={keyPartners} />
        </Fragment>
      )}
      {!!keyResources.length && (
        <Fragment>
          <CanvasReportHeader>Key resources</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={keyResources} />
        </Fragment>
      )}
      {!!costLines.length && (
        <Fragment>
          <CanvasReportHeader>Cost structure</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={costLines} />
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
          <CanvasReportItemList isSimple sort={sortByTitle} items={channels} />
        </Fragment>
      )}
      {!!customerRelationships.length && (
        <Fragment>
          <CanvasReportHeader>Customer relationships</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={customerRelationships} />
        </Fragment>
      )}
      {!!revenueStreams.length && (
        <Fragment>
          <CanvasReportHeader>Revenue streams</CanvasReportHeader>
          <CanvasReportItemList isSimple sort={sortByTitle} items={revenueStreams} />
        </Fragment>
      )}
    </ListWrapper>
  </CanvasReportSection>
);

CanvasReportItems.propTypes = {
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

export default CanvasReportItems;
