import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { pure } from 'recompose';
import { pluck } from 'ramda';

import { Query as Queries } from '../../../graphql';
import {
  RenderSwitch,
  PreloaderPage,
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
} from '../../components';
import CanvasDoughnutChart from './CanvasDoughnutChart';

const getChartData = customerSegments => ({
  data: pluck('percentOfMarketSize', customerSegments),
  labels: pluck('title', customerSegments),
  colors: pluck('color', customerSegments),
});

const CustomerSegmentsChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.CUSTOMER_SEGMENTS_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ loading, error, data }) => (
      <EntityModalNext
        {...{ isOpen, toggle, error }}
        guidance="Customer segments"
        noForm
      >
        <EntityModalHeader label="Customer segments" />
        <EntityModalBody>
          <RenderSwitch
            {...{ loading, error }}
            require={data && data.customerSegments}
            renderLoading={<PreloaderPage />}
          >
            {({ customerSegments }) => (
              <CanvasDoughnutChart
                {...getChartData(customerSegments)}
                title="% of market"
              />
            )}
          </RenderSwitch>
        </EntityModalBody>

      </EntityModalNext>
    )}
  </Query>
);

CustomerSegmentsChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerSegmentsChartModal);
