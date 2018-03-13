import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  TimelineChart,
  TimelineCurrentDateLine,
  TimelineHorizontalLine,
} from '../../components';
import GoalsChartActionsListContainer from '../containers/GoalsChartActionsListContainer';

const getChartPoints = ({ milestones }) => (
  milestones.map(({ completionTargetDate, title: milestoneTitle }) => ({
    x: new Date(completionTargetDate),
    label: milestoneTitle,
  }))
);

const getScaleDates = (timeScale) => {
  const MONTH_DAYS = 30;
  const DENOMINATOR = 8;
  const dayTimeScale = timeScale * MONTH_DAYS;
  const daysBeforeToday = dayTimeScale / DENOMINATOR;
  const start = moment().subtract(daysBeforeToday, 'days');
  const end = moment().add(dayTimeScale - daysBeforeToday, 'days');
  return {
    start: start.toDate(),
    end: end.toDate(),
  };
};

const GoalsChart = ({ goals, timeScale, organizationId }) => {
  const height = 65 * goals.length + 35;
  const scaleDates = getScaleDates(timeScale);

  return (
    <TimelineChart
      {...{
        height,
        width: 1140,
        domain: {
          x: [scaleDates.start, scaleDates.end],
          y: [-1, goals.length],
        },
      }}
    >
      {/* VictoryChart expects components to be direct children */}
      {TimelineCurrentDateLine({ height })}
      {goals.map((goal, index) => (
        <TimelineHorizontalLine
          {...{
            index,
            scaleDates,
            key: goal._id,
            entityId: goal._id,
            color: goal.color,
            title: goal.title,
            startDate: goal.startDate,
            endDate: goal.endDate,
            points: getChartPoints(goal),
            renderPopoverContent: props =>
              <GoalsChartActionsListContainer {...{ goal, organizationId, ...props }} />,
          }}
        />
      ))}
    </TimelineChart>
  );
};

GoalsChart.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeScale: PropTypes.number.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default GoalsChart;
