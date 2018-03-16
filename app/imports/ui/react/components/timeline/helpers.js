export const getTitleDX = (textAnchor) => {
  switch (textAnchor) {
    case 'start': return -8;
    case 'end': return 8;
    default: return 0;
  }
};

export const getLineCenter = (start, end) => new Date(start + (end - start) / 2);
