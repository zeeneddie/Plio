import { reduce, curry } from 'ramda';
import pickDeep from './pickDeep';

// pickDocuments(
//   ['_id', 'profile.firstName'],
//   [{ _id: 1, profile: { firstName: 'Alan', ... }, ... }, ...],
//   1
// );
// => { _id: 1, firstName: 'Alan' }
export default curry((fields, collection, ids) => {
  if (typeof ids !== 'string' && !Array.isArray(ids)) return ids;

  if (typeof ids === 'string') return pickDeep(fields, collection[ids]);

  const reducer = (prev, cur) => {
    const doc = collection[cur];

    if (doc) return prev.concat(pickDeep(fields, doc));

    return prev;
  };

  return reduce(reducer, [], ids);
});
