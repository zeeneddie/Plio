import React from 'react';
import PropTypes from 'prop-types';
import { pick } from 'ramda';

import {
  TimelineChart,
  TimelineHorizontalLine,
} from '../../components/timeline';
import { Timeline } from '../../../../api/constants';
import ActionsMilestonesListContainer from '../containers/ActionsMilestonesListContainer';

const GoalsChart = ({ goals, timeScale, onEdit }) => (
  <TimelineChart
    scaleType={timeScale}
    partOfPastTime={Timeline.PART_OF_PAST_TIME}
    maxWidth={Timeline.WIDTH}
    lineHeight={Timeline.LINE_HEIGHT}
    axisHeight={Timeline.AXIS_HEIGHT}
    items={goals}
    renderLine={({ item: goal, scaleDates }) => (
      <TimelineHorizontalLine
        {...{
          scaleDates,
          entityId: goal._id,
          onClickPoints: onEdit,
          ...pick(['color', 'title', 'startDate', 'endDate', 'points'], goal),
        }}
      />
    )}
    renderTimelineList={({ item: goal }) => (
      <ActionsMilestonesListContainer {...{ goal }} />
    )}
  />
);

GoalsChart.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeScale: PropTypes.number.isRequired,
  onEdit: PropTypes.func,
};

export default GoalsChart;
