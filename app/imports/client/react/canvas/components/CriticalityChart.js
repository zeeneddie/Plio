import React from 'react';

import { DefaultChartAspectRatio, CriticalityLabels } from '../../../../api/constants';
import { LoadableBubbleChart } from '../../components';

const CriticalityChart = (props) => {
  const aspectRatio = window.innerHeight / window.innerWidth;
  return (
    <LoadableBubbleChart
      width={DefaultChartAspectRatio.WIDTH}
      height={aspectRatio <= 1 ? DefaultChartAspectRatio.HEIGHT : aspectRatio}
      xScaleLabels={[CriticalityLabels.LOW, '', CriticalityLabels.HIGH]}
      yScaleLabels={[CriticalityLabels.HIGH, '', CriticalityLabels.LOW]}
      xTitle="Spend"
      yTitle="Criticality"
      {...props}
    />
  );
};

export default CriticalityChart;
