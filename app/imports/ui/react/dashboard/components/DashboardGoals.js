// import PropTypes from 'prop-types';
import React from 'react';
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryAxis,
  VictoryLine,
  VictoryLabel,
  VictoryScatter,
  VictoryTooltip,
} from 'victory';

const fontFamily = '"Roboto", "Helvetica Neue", Helvetica, sans-serif';

const getLineData = ({
  startDate,
  endDate,
  title,
  milestones = [],
}, index) => [
  { x: new Date(startDate), y: index, label: title },
  { x: new Date(endDate), y: index },
  ...milestones.map(({ completionTargetDate }, y) => ({
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
}, index) => [
  {
    x: new Date(startDate),
    y: index,
    label: `${title} \n start date: \n ${new Date(startDate).toDateString()}`,
    symbol: 'circle',
    strokeWidth: 7,
    fill: color,
  },
  {
    x: new Date(endDate),
    y: index,
    label: `${title} \n end date: \n ${new Date(endDate).toDateString()}`,
    symbol: 'circle',
    strokeWidth: 7,
    fill: color,
  },
  ...milestones.map(({ completionTargetDate, title: milestoneTitle }) => ({
    x: new Date(completionTargetDate),
    y: index,
    label: milestoneTitle,
    symbol: 'square',
    strokeWidth: 3,
    size: 5,
    fill: color,
  })),
];

const DashboardGoals = ({
  data: { loading, goals },
  zoomDomain,
  onZoom,
  onLineTap,
  onScatterTap,
}) => !loading && (
  <VictoryChart
    width={1140}
    height={400}
    scale={{ x: 'time' }}
    domainPadding={{ x: [20, 20] }}
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
    containerComponent={(
      <VictoryZoomContainer
        dimension="x"
        zoomDomain={zoomDomain}
        onDomainChange={onZoom}
      />
    )}
    padding={{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}
  >
    <VictoryAxis
      style={{
        axis: {
          stroke: 'none',
        },
        tickLabels: {
          angle: 0,
          padding: 30,
          border: 1,
          fontFamily,
        },
      }}
    />
    <VictoryLine
      style={{
        data: { stroke: '#888', strokeWidth: 1, fontFamily },
        labels: { fill: '#888' },
      }}
      data={[
        { x: new Date(), y: 0, label: 'today' },
        { x: new Date(), y: 400 },
      ]}
      labelComponent={<VictoryLabel dy={35} />}
    />
    {goals.map((goal, index) => (
      <VictoryLine
        key={index}
        animate={{ duration: 500 }}
        style={{
          data: {
            stroke: goal.color,
            strokeWidth: 4,
            cursor: 'pointer',
          },
          labels: {
            fontFamily,
            fill: '#888',
            fontWeight: 'lighter',
            textAnchor: 'start',
          },
        }}
        events={[{
          target: 'data',
          eventHandlers: {
            onClick: e => onLineTap(e, goal),
          },
        }]}
        data={getLineData(goal, index)}
        labelComponent={<VictoryLabel x={450} />}
      />
    ))}
    {goals.map((goal, index) => (
      <VictoryScatter
        key={index}
        style={{
          data: {
            stroke: goal.color,
            cursor: 'pointer',
          },
          labels: { fontFamily },
        }}
        events={[{
          target: 'data',
          eventHandlers: {
            onClick: onScatterTap,
          },
        }]}
        data={getScatterData(goal, index)}
        labelComponent={<VictoryTooltip />}
      />
    ))}
  </VictoryChart>
);

DashboardGoals.propTypes = {};

export default DashboardGoals;
