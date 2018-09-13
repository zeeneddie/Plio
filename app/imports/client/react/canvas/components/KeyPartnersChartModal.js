import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { pure } from 'recompose';
import { map } from 'ramda';

import { Query as Queries } from '../../../graphql';
import { CanvasBubbleChartSize, CriticalityLabels } from '../../../../api/constants';
import {
  RenderSwitch,
  PreloaderPage,
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  LoadableBubbleChart,
  CardBlock,
} from '../../components';

const getChartData = map(({
  levelOfSpend,
  criticality,
  color,
  title,
}) => ({
  data: [{ x: levelOfSpend, y: criticality }],
  backgroundColor: color,
  label: title,
}));

const KeyPartnersChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.KEY_PARTNERS_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ loading, error, data }) => (
      <EntityModalNext
        {...{ isOpen, toggle, error }}
        guidance="Key partners"
        noForm
      >
        <EntityModalHeader label="Key partners" />
        <EntityModalBody>
          <RenderSwitch
            {...{ loading, error }}
            require={data && data.keyPartners}
            renderLoading={<PreloaderPage />}
          >
            {({ keyPartners }) => (
              <CardBlock>
                <LoadableBubbleChart
                  width={CanvasBubbleChartSize.WIDTH}
                  height={CanvasBubbleChartSize.HEIGHT}
                  xScaleLabels={[CriticalityLabels.LOW, '', CriticalityLabels.HIGH]}
                  yScaleLabels={[CriticalityLabels.HIGH, '', CriticalityLabels.LOW]}
                  xTitle="Spend"
                  yTitle="Criticality"
                  data={{ datasets: getChartData(keyPartners) }}
                />
              </CardBlock>
            )}
          </RenderSwitch>
        </EntityModalBody>

      </EntityModalNext>
    )}
  </Query>
);

KeyPartnersChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyPartnersChartModal);
