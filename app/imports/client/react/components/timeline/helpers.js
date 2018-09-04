import moment from 'moment';
import { max, min } from 'ramda';
import { TAIL_WIDTH } from './constants';

export const getTitleDX = (textAnchor) => {
  switch (textAnchor) {
    case 'start': return -8;
    case 'end': return 8;
    default: return 0;
  }
};

export const getLineCenter = (start, end) => new Date(start + (end - start) / 2);

const currentDay = () => moment().startOf('day');

export const getScaleDates = (monthScale, partOfPastTime) => {
  const msScale = currentDay().add(monthScale, 'months').diff(currentDay(), 'ms');
  const msBeforeToday = msScale * partOfPastTime;
  const start = currentDay().subtract(msBeforeToday, 'ms');
  const end = currentDay().add(msScale - msBeforeToday, 'ms');
  return {
    start: start.toDate(),
    end: end.toDate(),
  };
};

export const getTimelineListProps = (scaleDates, start, end) => {
  const scaleStart = scaleDates.start.getTime();
  const scaleEnd = scaleDates.end.getTime();

  if (end < scaleStart) {
    return { float: 'left' };
  }

  if (start > scaleEnd) {
    return { float: 'right' };
  }

  const lineStart = max(start, scaleStart);
  const lineEnd = min(end, scaleEnd);
  const scaleInterval = scaleEnd - scaleStart;
  const lineInterval = lineEnd - lineStart;
  const intervalToStartOfLine = lineStart - scaleStart;

  return {
    left: intervalToStartOfLine * 100 / scaleInterval,
    width: lineInterval * 100 / scaleInterval,
  };
};

export const pathHelpers = {
  arrowLeft: (x, y, size, tail = '') => {
    const height = size / 2 * Math.sqrt(3);
    const x0 = x - size;
    const x1 = x + height;
    const y0 = y - size;
    const y1 = y + size;
    return `M ${x0}, ${y}
      L ${x1}, ${y0}
      ${tail}
      L ${x1}, ${y1}
      z`;
  },
  arrowLeftWithTail: (x, y, size) => {
    const height = size / 2 * Math.sqrt(3);
    const x1 = x + height;
    const xTail = x1 + TAIL_WIDTH;
    return pathHelpers.arrowLeft(x, y, size, `
      L ${x1}, ${y}
      L ${xTail}, ${y}
      L ${x1}, ${y}
    `);
  },
  arrowRight: (x, y, size, tail = '') => {
    const height = size / 2 * Math.sqrt(3);
    const x0 = x + height;
    const x1 = x - size;
    const y0 = y - size;
    const y1 = y + size;
    return `M ${x0}, ${y}
      L ${x1}, ${y0}
      ${tail}
      L ${x1}, ${y1}
      z`;
  },
  arrowRightWithTail: (x, y, size) => {
    const x1 = x - size;
    const xTail = x1 - TAIL_WIDTH;
    return pathHelpers.arrowRight(x, y, size, `
      L ${x1}, ${y}
      L ${xTail}, ${y}
      L ${x1}, ${y}
    `);
  },
};
