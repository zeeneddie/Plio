import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { generateColors, getOtherPercent } from '../helpers';
import CanvasDoughnutChart from './CanvasDoughnutChart';
import CanvasReportChart from './CanvasReportChart';
import CanvasReportChartLabels from './CanvasReportChartLabels';
import CanvasReportDoughnutChartLabel from './CanvasReportDoughnutChartLabel';

const CanvasReportDoughnutChart = ({ data, labels, ...rest }) => {
  const otherPercent = getOtherPercent(data);
  const colors = generateColors(data);
  return (
    <Fragment>
      <CanvasReportChart {...rest}>
        <CanvasDoughnutChart
          {...{ data, colors }}
          options={{ tooltips: false }}
        />
      </CanvasReportChart>
      <CanvasReportChartLabels>
        {labels.map((label, index) => (
          <CanvasReportDoughnutChartLabel
            {...{ label }}
            key={label + data[index]}
            color={colors[index]}
            percent={data[index]}
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
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CanvasReportDoughnutChart;
