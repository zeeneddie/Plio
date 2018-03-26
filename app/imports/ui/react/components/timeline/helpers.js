import { TAIL_WIDTH } from './constants';

export const getTitleDX = (textAnchor) => {
  switch (textAnchor) {
    case 'start': return -8;
    case 'end': return 8;
    default: return 0;
  }
};

export const getLineCenter = (start, end) => new Date(start + (end - start) / 2);

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
