import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  TimelineChart,
  TimelineCurrentDateLine,
  TimelineHorizontalLine,
  TimelinePoint,
} from '../../components';
import GoalsChartActionsListContainer from '../containers/GoalsChartActionsListContainer';

const getLineData = ({
  startDate,
  endDate,
  title,
  milestones = [],
}, y) => [
  { x: new Date(startDate), y, label: title },
  { x: new Date(endDate), y },
  ...milestones.map(({ completionTargetDate }) => ({
    y,
    x: new Date(completionTargetDate),
  })),
];

const getScatterData = ({
  title,
  startDate,
  endDate,
  color,
  milestones = [],
}, y) => [
  {
    y,
    x: new Date(startDate),
    label: `${title} \n start date: \n ${new Date(startDate).toDateString()}`,
    symbol: 'circle',
    strokeWidth: 7,
    fill: color,
  },
  {
    y,
    x: new Date(endDate),
    label: `${title} \n end date: \n ${new Date(endDate).toDateString()}`,
    symbol: 'circle',
    strokeWidth: 7,
    fill: color,
  },
  ...milestones.map(({ completionTargetDate, title: milestoneTitle }) => ({
    y,
    x: new Date(completionTargetDate),
    label: milestoneTitle,
    symbol: 'square',
    strokeWidth: 3,
    size: 5,
    fill: color,
  })),
];

const getXDomainData = (timeScale) => {
  const MONTH_DAYS = 30;
  const DENOMINATOR = 8;
  const dayTimeScale = timeScale * MONTH_DAYS;
  const daysBeforeToday = dayTimeScale / DENOMINATOR;
  const startDate = moment().subtract(daysBeforeToday, 'days');
  const endDate = moment().add(dayTimeScale - daysBeforeToday, 'days');
  return [
    startDate.toDate(),
    endDate.toDate(),
  ];
};

const GoalsChart = ({ goals, timeScale, organizationId }) => {
  const height = 55 * goals.length + 45;
  const domainPadding = { x: [0, 0], y: [0, -35] };

  return (
    <TimelineChart
      width={1140}
      domain={{
        x: getXDomainData(timeScale),
        y: [
          -1,
          goals.length,
        ],
      }}
      {...{ height }}
    >
      {/* VictoryChart expects components to be direct children */}
      {TimelineCurrentDateLine({ height })}
      {goals.map((goal, index) => TimelineHorizontalLine({
        key: goal._id,
        data: getLineData(goal, index),
        color: goal.color,
        domainPadding,
      }))}
      {goals.map((goal, index) => TimelinePoint({
        key: goal._id,
        entityId: goal._id,
        color: goal.color,
        data: getScatterData(goal, index),
        renderPopoverContent: props =>
          <GoalsChartActionsListContainer {...{ goal, organizationId, ...props }} />,
        domainPadding,
      }))}
    </TimelineChart>
  );
};

GoalsChart.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeScale: PropTypes.number.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default GoalsChart;
