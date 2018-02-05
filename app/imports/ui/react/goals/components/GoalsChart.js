import React from 'react';
import PropTypes from 'prop-types';
import {
  TimelineChart,
  TimelineCurrentDateLine,
  TimelineHorizontalLine,
  TimelinePoint,
} from '../../components';

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

const GoalsChart = ({
  goals,
  onScatterTap,
}) => {
  const height = 50 * goals.length + 30;

  return (
    <TimelineChart
      width={1140}
      domain={{
        x: [
          new Date('01 January 2018'),
          new Date('01 January 2019'),
        ],
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
      }))}
      {goals.map((goal, index) => TimelinePoint({
        key: goal._id,
        color: goal.color,
        onClick: (e, ...args) => onScatterTap(e, goal, ...args),
        data: getScatterData(goal, index),
      }))}
    </TimelineChart>
  );
};

GoalsChart.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  onScatterTap: PropTypes.func,
};

export default GoalsChart;
