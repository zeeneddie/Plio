import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { getCriticalityLevelLabel } from '../helpers';
import CriticalityChart from './CriticalityChart';
import CanvasReportChart from './CanvasReportChart';
import CanvasReportChartLabels from './CanvasReportChartLabels';
import CanvasReportCriticalityChartLabel from './CanvasReportCriticalityChartLabel';

const CanvasReportCriticalityChart = ({ data, ...rest }) => (
  <Fragment>
    <CanvasReportChart {...rest}>
      <CriticalityChart
        data={{ datasets: data }}
        options={{
          tooltips: false,
          legend: false,
        }}
      />
    </CanvasReportChart>
    {!!data.length && (
      <CanvasReportChartLabels>
        <CanvasReportCriticalityChartLabel x="SPEND" y="CRITICALITY" />
        {data.map(({ label, backgroundColor, data: points }) => (
          <CanvasReportCriticalityChartLabel
            {...{ label }}
            key={label + points[0].y + points[0].x}
            color={backgroundColor}
            x={getCriticalityLevelLabel(points[0].x)}
            y={getCriticalityLevelLabel(points[0].y)}
          />
        ))}
      </CanvasReportChartLabels>
    )}
  </Fragment>
);

CanvasReportCriticalityChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CanvasReportCriticalityChart;
