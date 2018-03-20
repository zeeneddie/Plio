import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  TimelineChart,
  TimelineCurrentDateLine,
  TimelineHorizontalLine,
} from '../../components';
import GoalsChartActionsContainer from '../containers/GoalsChartActionsContainer';
import MilestoneChartActionsContainer from '../containers/MilestoneChartActionsContainer';

const getChartPoints = ({ _id: goalId, milestones }, canEditGoals) => (
  milestones.map(milestone => ({
    x: new Date(milestone.completionTargetDate),
    label: milestone.title,
    renderPopover: props =>
      <MilestoneChartActionsContainer {...{ ...props, ...milestone, goalId }} />,
  }))
);

const getChartHeight = (goals) => {
  const ITEM_HEIGHT = 65;
  const AXIS_HEIGHT = 35;
  return ITEM_HEIGHT * goals.length + AXIS_HEIGHT;
};

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

const GoalsChart = ({
  goals,
  timeScale,
  organizationId,
  canEditGoals,
}) => {
  const height = getChartHeight(goals);
  const scaleDates = getScaleDates(timeScale);

  return (
    <TimelineChart
      {...{
        height,
        maxWidth: 1140,
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
            points: getChartPoints(goal, canEditGoals),
            renderPopover: props => (
              <GoalsChartActionsContainer
                {...{
                  ...props,
                  goal,
                  organizationId,
                  canEditGoals,
                }}
              />
            ),
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
  canEditGoals: PropTypes.bool,
};

export default GoalsChart;
