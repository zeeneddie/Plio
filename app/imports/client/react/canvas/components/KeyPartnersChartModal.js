import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { pathOr } from 'ramda';
import { noop, sortByIds } from 'plio-util';

import { Query as Queries } from '../../../graphql';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';
import {
  getCriticalityValueLabel,
  getKeyPartnerChartData,
} from '../helpers';
import {
  RenderSwitch,
  PreloaderPage,
  EntityModalHeader,
  EntityModalBody,
  CardBlock,
  ChartModal,
} from '../../components';
import ModalGuidancePanel from '../../guidance/components/ModalGuidancePanel';
import CriticalityChart from './CriticalityChart';

const getChartData = ({
  keyPartners: { keyPartners },
  canvasSettings: { canvasSettings },
} = {}) => {
  const order = pathOr([], [CanvasSections[CanvasTypes.KEY_PARTNER], 'order'], canvasSettings);
  const orderedKeyPartners = sortByIds(order, keyPartners);
  return getKeyPartnerChartData(orderedKeyPartners);
};

const KeyPartnersChartModal = ({ isOpen, toggle, organizationId }) => (
  <Query
    query={Queries.KEY_PARTNERS_CHART}
    variables={{ organizationId }}
    skip={!isOpen}
  >
    {({ loading, error, data }) => (
      <ChartModal
        {...{ isOpen, toggle, error }}
        noForm
      >
        <EntityModalHeader label="Key partners" />
        <EntityModalBody>
          <ModalGuidancePanel documentType={CanvasTypes.KEY_PARTNER} />
          <RenderSwitch
            {...{ loading, error }}
            errorWhenMissing={noop}
            require={data && data.keyPartners}
            renderLoading={<PreloaderPage />}
          >
            {() => (
              <CardBlock>
                <CriticalityChart
                  data={{ datasets: getChartData(data) }}
                  valueFormatter={getCriticalityValueLabel}
                />
              </CardBlock>
            )}
          </RenderSwitch>
        </EntityModalBody>
      </ChartModal>
    )}
  </Query>
);

KeyPartnersChartModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default React.memo(KeyPartnersChartModal);
