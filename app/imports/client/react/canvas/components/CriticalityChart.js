import React from 'react';

import { CriticalityLabels } from '../../../../api/constants';
import { LoadableBubbleChart } from '../../components';

const CriticalityChart = props => (
  <LoadableBubbleChart
    xScaleLabels={[CriticalityLabels.LOW, '', CriticalityLabels.HIGH]}
    yScaleLabels={[CriticalityLabels.HIGH, '', CriticalityLabels.LOW]}
    xTitle="Spend"
    yTitle="Criticality"
    {...props}
  />
);

export default CriticalityChart;
