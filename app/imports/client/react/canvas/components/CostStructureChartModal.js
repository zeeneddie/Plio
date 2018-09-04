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

const getChartData = costLines => ({
  data: pluck('percentOfTotalCost', costLines),
  labels: pluck('title', costLines),
  colors: pluck('color', costLines),
});

const CostStructureChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.COST_LINES_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ error, loading, data }) => (
      <EntityModalNext
        {...{ isOpen, toggle, error }}
        guidance="Cost Structure"
        noForm
      >
        <EntityModalHeader label="Cost Structure" />
        <EntityModalBody>
          <RenderSwitch
            {...{ loading }}
            require={data && data.costLines}
            renderLoading={<PreloaderPage />}
          >
            {({ costLines }) => (
              <CanvasDoughnutChart
                {...getChartData(costLines)}
                title="% of total costs"
              />
            )}
          </RenderSwitch>
        </EntityModalBody>
      </EntityModalNext>
    )}
  </Query>
);

CostStructureChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CostStructureChartModal);
