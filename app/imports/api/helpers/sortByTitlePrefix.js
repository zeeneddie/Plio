import { sort } from 'ramda';
import getTitlePrefix from './getTitlePrefix';

// 1, 1.2, 3, 10.3, a, b, c
export default sort((a, b) => {
  const at = getTitlePrefix(`${a.titlePrefix}`.toLowerCase());
  const bt = getTitlePrefix(`${b.titlePrefix}`.toLowerCase());

  if (typeof at === 'number' && typeof bt !== 'number') {
    return -1;
  }
  if (typeof bt === 'number' && typeof at !== 'number') {
    return 1;
  }
  if (at < bt) {
    return -1;
  }
  if (at > bt) {
    return 1;
  }
  return at === bt ? 0 : -1;
});
