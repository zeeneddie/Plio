import React from 'react';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import EntityModalNext from '../EntityModalNext/EntityModal';

const StyledEntityModalNext = styled(({ bodyHeight, ...rest }) => <EntityModalNext {...rest} />)`
  max-width: 100%;
  display: inline-block;
  width: auto !important;
  height: calc(100vh - 60px);
  .guidance-panel {
    text-align: left;
    & > .card-block {
      padding-top: 0;
    }
  }
  .modal-content {
    margin: 0;
  }
  .modal-body > .card-block:last-of-type {
    position: relative;
    height: calc(100vh - 115px);
    width: calc(100vh - 115px);
  }
  ${StyledMixins.media.mobile`
    display: block;
    margin: 0;
    .modal-body > .card-block:last-of-type {
      height: calc(100vh - 56px);
      width: auto;
    }
  `};
`;

const ChartModal = props => (
  /* wrapClassName is chartjs prop. It is needed for creating wrapper element under chart canvas */
  <StyledEntityModalNext
    {...props}
    wrapClassName="chart-modal"
  />
);

export default ChartModal;
