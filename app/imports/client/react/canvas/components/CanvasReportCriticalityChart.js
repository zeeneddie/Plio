import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { getCriticalityLevelLabel } from '../helpers';
import { CANVAS_REPORT_CHART_SIZE } from '../constants';
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
          maintainAspectRatio: true,
          layout: {},
        }}
        width={CANVAS_REPORT_CHART_SIZE}
        height={CANVAS_REPORT_CHART_SIZE}
      />
    </CanvasReportChart>
    {!!data.length && (
      <CanvasReportChartLabels>
        <CanvasReportCriticalityChartLabel x="SPEND" y="CRITICALITY" />
        {data.map(({
          _id,
          label,
          backgroundColor,
          data: points,
        }) => (
          <CanvasReportCriticalityChartLabel
            {...{ label }}
            key={_id}
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
