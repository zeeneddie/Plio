import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pick } from 'ramda';

import {
  TimelineChart,
  TimelineHorizontalLine,
} from '../../components';
import { Timeline } from '../../../../api/constants';
import ActionsMilestonesList from './ActionsMilestonesList';

const GoalsChart = ({ goals, timeScale, onEdit }) => (
  <Fragment>
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
        <ActionsMilestonesList
          {...{ goal }}
          onEditGoal={onEdit}
        />
      )}
    />
  </Fragment>
);

GoalsChart.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeScale: PropTypes.number.isRequired,
  onEdit: PropTypes.func,
};

export default GoalsChart;
