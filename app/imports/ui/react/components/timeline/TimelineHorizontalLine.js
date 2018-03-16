import PropTypes from 'prop-types';
import React from 'react';
import { VictoryLine, VictoryScatter } from 'victory';
import { withProps } from 'recompose';
import TimelineTitle from './TimelineTitle';
import HorizontalLinePoints from './HorizontalLinePoints';

const enhance = withProps(({
  scaleDates,
  startDate,
  endDate,
  title,
  color,
  index,
  points,
  renderPopover,
}) => {
  const isLineOutOfScaleRight = startDate > scaleDates.end;
  const isLineOutOfScale = isLineOutOfScaleRight || endDate < scaleDates.start;
  const isStartWithinScale = !isLineOutOfScaleRight && startDate > scaleDates.start;
  const isEndWithinScale = endDate < scaleDates.end;

  const start = !isStartWithinScale && (isLineOutOfScaleRight ? scaleDates.end : scaleDates.start);
  const startSymbol = !isStartWithinScale && (isLineOutOfScaleRight ? 'arrowRight' : 'arrowLeft');
  const end = isEndWithinScale || isLineOutOfScaleRight ? endDate : scaleDates.end;
  const lineTitleAnchor = isLineOutOfScale && (isLineOutOfScaleRight ? 'end' : 'start');
  return {
    lineData: [
      {
        x: start || startDate,
        y: index,
        label: title,
        textAnchor: lineTitleAnchor || 'middle',
      },
      {
        x: isLineOutOfScale ? start : end,
        y: index,
      },
    ],
    pointsData: [
      {
        y: index,
        x: start || startDate,
        title: startDate,
        fill: color,
        isStart: true,
        label: 'Start Date',
        titleAnchor: isLineOutOfScaleRight ? 'end' : 'start',
        symbol: startSymbol || 'circle',
        strokeWidth: isStartWithinScale ? 10 : 2,
        renderPopover,
      },
      {
        y: index,
        x: end,
        title: endDate,
        fill: color,
        startDate: start || startDate,
        isEnd: true,
        label: 'End Date',
        titleAnchor: 'end',
        symbol: isEndWithinScale ? 'circle' : 'arrowRight',
        strokeWidth: isEndWithinScale ? 10 : 2,
        renderPopover,
      },
      ...points.map(point => ({
        y: index,
        symbol: 'square',
        strokeWidth: 3,
        size: 5,
        fill: color,
        renderPopover,
        ...point,
      })),
    ],
  };
});

const TimelineHorizontalLine = ({
  color,
  onClick,
  lineData,
  entityId,
  pointsData,
  ...props
}) => {
  const domainPadding = { x: [0, 0], y: [20, -35] };
  return (
    <g>
      <VictoryLine
        {...{
          ...props,
          domainPadding,
          data: lineData,
          animate: { duration: 500 },
          style: {
            data: {
              stroke: color,
              strokeWidth: 4,
              cursor: 'pointer',
            },
          },
          events: [{
            target: 'data',
            eventHandlers: { onClick },
          }],
        }}
        labelComponent={<TimelineTitle />}
      />
      <HorizontalLinePoints
        {...{
          ...props,
          entityId,
          color,
          domainPadding,
          data: pointsData,
        }}
      />
    </g>
  );
};

TimelineHorizontalLine.propTypes = {
  color: PropTypes.string.isRequired,
  entityId: PropTypes.string,
  onClick: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  lineData: VictoryLine.propTypes.data,
  pointsData: VictoryScatter.propTypes.data,
};

export default enhance(TimelineHorizontalLine);
