import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { append } from 'ramda';
import { pure } from 'recompose';

import { DefaultChartAspectRatio } from '../../../../api/constants';
import { generateColors, getOtherPercent } from '../helpers';
import { LoadableDoughnutChart, CardBlock } from '../../components';

const StyledCardBlock = styled(CardBlock)`
  .modal-dialog &.card-block.card-body {
    border-top: none;
    padding-top: 0;
  }
`;

const CanvasDoughnutChart = ({
  data,
  labels,
  colors = generateColors(data),
  ...props
}) => {
  const otherPercent = getOtherPercent(data);
  const aspectRatio = window.innerHeight / window.innerWidth;

  return (
    <StyledCardBlock>
      <LoadableDoughnutChart
        {...props}
        width={DefaultChartAspectRatio.WIDTH}
        height={aspectRatio <= 1 ? DefaultChartAspectRatio.HEIGHT : aspectRatio}
        data={{
          datasets: [{
            data: otherPercent ? append(otherPercent, data) : data,
            backgroundColor: colors,
          }],
          labels: labels && (otherPercent ? append('Other', labels) : labels),
        }}
      />
    </StyledCardBlock>
  );
};

CanvasDoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  colors: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default pure(CanvasDoughnutChart);
