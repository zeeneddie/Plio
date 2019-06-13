import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import RevenueStreamAddModal from './RevenueStreamAddModal';
import RevenueStreamEditModal from './RevenueStreamEditModal';
import RevenueStreamsChartModal from './RevenueStreamsChartModal';
import CanvasBlock from './CanvasBlock';
import RevenueStreamsHelp from './RevenueStreamsHelp';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes, DocumentTypes } from '../../../../share/constants';

const RevenueStreams = ({ organizationId }) => (
  <Query
    query={Queries.REVENUE_STREAMS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { revenueStreams: { revenueStreams = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        twoColumn
        label="Revenue streams"
        sectionName={CanvasSections[CanvasTypes.REVENUE_STREAM]}
        documentType={DocumentTypes.REVENUE_STREAM}
        help={<RevenueStreamsHelp />}
        items={revenueStreams}
        renderModal={({ isOpen, toggle, onLink }) => (
          <RevenueStreamAddModal
            {...{
              isOpen,
              toggle,
              organizationId,
              onLink,
            }}
          />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <RevenueStreamEditModal
            {...{
              isOpen,
              toggle,
              organizationId,
              _id,
            }}
          />
        )}
        renderChartModal={({ isOpen, toggle }) => (
          <RevenueStreamsChartModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

RevenueStreams.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(RevenueStreams);
