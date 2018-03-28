import PropTypes from 'prop-types';
import React from 'react';
import { VictoryLine, VictoryScatter } from 'victory';
import { withProps } from 'recompose';
import TimelineTitle from './TimelineTitle';
import HorizontalLinePoints from './HorizontalLinePoints';

const getStartSymbol = ({ isStartWithinScale, isLineOutOfScaleRight, isLineOutOfScale }) => {
  if (isLineOutOfScale) {
    return isLineOutOfScaleRight ? 'arrowRightWithTail' : 'arrowLeftWithTail';
  }
  return isStartWithinScale ? 'circle' : 'arrowLeft';
};

const getEndSymbol = ({ isEndWithinScale, isLineOutOfScale }) => {
  if (isLineOutOfScale) {
    return 'arrowRightWithTail';
  }
  return isEndWithinScale ? 'circle' : 'arrowRight';
};

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
        symbol: getStartSymbol({ isStartWithinScale, isLineOutOfScaleRight, isLineOutOfScale }),
        strokeWidth: isStartWithinScale ? 10 : 5,
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
        symbol: getEndSymbol({ isEndWithinScale, isLineOutOfScale }),
        strokeWidth: isEndWithinScale ? 10 : 5,
        renderPopover,
      },
      ...points.map(point => ({
        y: index,
        symbol: 'diamond',
        strokeWidth: 4,
        size: 7,
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
