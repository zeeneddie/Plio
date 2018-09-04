import { shallowEqual, shouldUpdate } from 'recompose';
import { pickDeepDotPath } from 'plio-util';

export default keys => shouldUpdate((props, nextProps) => {
  const pick = pickDeepDotPath(keys);
  return !shallowEqual(pick(props), pick(nextProps));
});
