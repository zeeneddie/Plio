import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { VictoryLine, VictoryScatter } from 'victory';
import { withProps } from 'recompose';
import { StatusColorsHex } from '../../../../api/constants';
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
  color,
  points,
  index = 0,
  onClickPoints,
  entityId,
}) => {
  const isLineOutOfScaleRight = startDate > scaleDates.end;
  const isLineOutOfScale = isLineOutOfScaleRight || endDate < scaleDates.start;
  const isStartWithinScale = !isLineOutOfScaleRight && startDate > scaleDates.start;
  const isEndWithinScale = endDate < scaleDates.end;
  const isOverduePoints = points.some(({ date, isCompleted }) => date < scaleDates.start && !isCompleted);
  const leftArrowSize = isOverduePoints ? 7 : 5;

  const start = !isStartWithinScale && (isLineOutOfScaleRight ? scaleDates.end : scaleDates.start);
  const end = isEndWithinScale || isLineOutOfScaleRight ? endDate : scaleDates.end;

  const events = onClickPoints ? [{
    target: 'parent',
    eventHandlers: {
      onClick: () => onClickPoints(entityId),
    },
  }] : [];

  return {
    index,
    events,
    lineData: [
      {
        x: start || startDate,
        y: index,
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
        fill: color,
        stroke: isOverduePoints && !isStartWithinScale ? StatusColorsHex.RED : color,
        label: `Starts ${moment(startDate).format('D MMM YYYY')}`,
        symbol: getStartSymbol({ isStartWithinScale, isLineOutOfScaleRight, isLineOutOfScale }),
        strokeWidth: isStartWithinScale ? 10 : leftArrowSize,
      },
      {
        y: index,
        x: end,
        fill: color,
        startDate: start || startDate,
        label: `Ends ${moment(endDate).format('D MMM YYYY')}`,
        symbol: getEndSymbol({ isEndWithinScale, isLineOutOfScale }),
        strokeWidth: isEndWithinScale ? 10 : 5,
      },
      ...points.map(point => ({
        x: point.date,
        y: index,
        fill: color,
        size: 9,
        ...point,
      })),
    ],
  };
});

const TimelineHorizontalLine = ({
  color,
  lineData,
  entityId,
  pointsData,
  onClickPoints,
  ...props
}) => {
  const domainPadding = { x: [0, 0], y: [30, 20] };
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
              cursor: onClickPoints ? 'pointer' : 'default',
            },
          },
        }}
      />
      <HorizontalLinePoints
        {...{
          ...props,
          entityId,
          color,
          domainPadding,
          data: pointsData,
          onClick: onClickPoints,
        }}
      />
    </g>
  );
};

TimelineHorizontalLine.propTypes = {
  color: PropTypes.string.isRequired,
  entityId: PropTypes.string,
  onClickPoints: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  lineData: VictoryLine.propTypes.data,
  pointsData: VictoryScatter.propTypes.data,
};

export default enhance(TimelineHorizontalLine);
