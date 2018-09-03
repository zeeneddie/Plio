import React from 'react';
import PropTypes from 'prop-types';
import { sum, append } from 'ramda';
import { pure } from 'recompose';

import { CanvasDoughnutChartSize } from '../../../../api/constants';
import { MAX_TOTAL_PERCENT } from '../../../../share/constants';
import { LoadableDoughnutChart } from '../../components';

const CanvasDoughnutChart = ({
  data,
  colors,
  labels,
  ...props
}) => {
  const otherPercentage = MAX_TOTAL_PERCENT - sum(data);
  const isOtherPart = otherPercentage > 0;

  return (
    <LoadableDoughnutChart
      {...props}
      width={CanvasDoughnutChartSize.WIDTH}
      height={CanvasDoughnutChartSize.HEIGHT}
      data={{
        datasets: [{
          data: isOtherPart ? append(otherPercentage, data) : data,
          backgroundColor: colors,
          borderWidth: 0,
        }],
        labels: isOtherPart ? append('Other', labels) : labels,
      }}
    />
  );
};

CanvasDoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  colors: PropTypes.arrayOf(PropTypes.string),
  labels: PropTypes.arrayOf(PropTypes.string),
};

export default pure(CanvasDoughnutChart);
