export const getNormalizedDataKey = prop => `${prop}ByIds`;

export const normalizeObject = ({ _id, ...props }) => ({ [_id]: { _id, ...props } });

export const normalizeArray = (array = []) =>
  array.reduce((prev, cur) => ({ ...prev, ...normalizeObject(cur) }), {});
