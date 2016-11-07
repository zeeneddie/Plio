import { compareProps, equals, compose, not } from '/imports/api/helpers';

export const addCollapsed = (collapsed, payload) => {
  const withoutClose = _.omit(payload, 'close');

  const result = payload.close && !_.isEmpty(payload.close)
    ? collapsed.filter(compose(not, compareProps(payload.close))).concat(withoutClose)
    : collapsed.concat(withoutClose);

  return _.uniq(result, true, (el, i, array) => array.find(equals(el)));
}

export const removeCollapsed = (collapsed, payload) => {
  const idx = collapsed.findIndex(equals(payload));
  const result = idx === -1
    ? collapsed
    : collapsed.slice(0, idx, idx + 1, collapsed.length);

  return result;
}
