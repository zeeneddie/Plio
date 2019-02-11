import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pluck } from 'ramda';

import { generateColors, getOtherPercent } from '../helpers';
import CanvasDoughnutChart from './CanvasDoughnutChart';
import CanvasReportChart from './CanvasReportChart';
import CanvasReportChartLabels from './CanvasReportChartLabels';
import CanvasReportDoughnutChartLabel from './CanvasReportDoughnutChartLabel';

const CanvasReportDoughnutChart = ({ data, ...rest }) => {
  const chartData = pluck('value', data);
  const otherPercent = getOtherPercent(chartData);
  const colors = generateColors(chartData);
  return (
    <Fragment>
      <CanvasReportChart {...rest}>
        <CanvasDoughnutChart
          {...{ colors }}
          data={chartData}
          options={{ tooltips: false }}
        />
      </CanvasReportChart>
      <CanvasReportChartLabels>
        {data.map(({ label, value, _id }, index) => (
          <CanvasReportDoughnutChartLabel
            {...{ label }}
            key={_id}
            percent={value}
            color={colors[index]}
          />
        ))}
        {!!otherPercent && (
          <CanvasReportDoughnutChartLabel
            color="#E2E2E2"
            label="Other"
            percent={otherPercent}
          />
        )}
      </CanvasReportChartLabels>
    </Fragment>
  );
};

CanvasReportDoughnutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CanvasReportDoughnutChart;
