import React from 'react';

import { CanvasBubbleChartSize, CriticalityLabels } from '../../../../api/constants';
import { LoadableBubbleChart } from '../../components';

const CriticalityChart = props => (
  <LoadableBubbleChart
    width={CanvasBubbleChartSize.WIDTH}
    height={CanvasBubbleChartSize.HEIGHT}
    xScaleLabels={[CriticalityLabels.LOW, '', CriticalityLabels.HIGH]}
    yScaleLabels={[CriticalityLabels.HIGH, '', CriticalityLabels.LOW]}
    xTitle="Spend"
    yTitle="Criticality"
    {...props}
  />
);

export default CriticalityChart;
