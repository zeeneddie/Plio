import React from 'react';
import styled from 'styled-components';

import EntityModalNext from '../EntityModalNext/EntityModal';

const StyledEntityModalNext = styled(({ bodyHeight, ...rest }) => <EntityModalNext {...rest} />)`
  max-width: 100%;
  display: inline-block;
  width: auto !important;
  height: calc(100vh - 60px);
  .guidance-panel {
    text-align: left;
  }
  .modal-body > .card-block:last-of-type {
    height: calc(100vh - 115px);
    width: calc(100vh - 115px);
    max-width: 100%;
  }
  @media (max-width: 600px) {
    display: block;
    .modal-body .card-block:last-of-type {
      width: auto;
      height: calc(100vh - 56px);
    }
    .modal-content {
      margin: 0;
    }
  }
`;

const ChartModal = props => (
  /* wrapClassName is chartjs prop. It is needed for creating wrapper element under chart canvas */
  <StyledEntityModalNext wrapClassName="chart-modal" {...props} />
);

export default ChartModal;
