import { curry } from 'ramda';
import get from 'lodash.get';

// pickDeep(['a.b.c'])({ a: { b: { c: 123 }}}) => { c: 123 }
export default curry((paths, obj) => Object.assign([], paths).reduce((acc, path) => ({
  ...acc,
  [path.replace(/.*\./g, '')]: get(obj, path),
}), {}));
