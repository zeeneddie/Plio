import curry from 'lodash.curry';
import property from 'lodash.property';
import { head } from 'ramda';

import { compose, find, propEqId, getC, filterC, length, getId } from '../../../api/helpers';

const getListData = curry((propName, id, items) => {
  const prop = property(propName);
  const eqId = propEqId(id);
  const filterDocs = _id => compose(length, filterC(propEqId(_id)), prop);
  const findDoc = compose(find(eqId), prop);

  const containedIn = find(findDoc, items);
  const containedInArray = filterC(filterDocs(id), items);
  const selectedDoc = findDoc(containedIn);
  const defaultDoc = getC(`${propName}[0]`, items[0]);
  const defaultContainedIn = head(items);
  const defaultContainedInArray = filterC(filterDocs(getId(defaultDoc)), items);

  return {
    containedIn,
    containedInArray,
    defaultDoc,
    selectedDoc,
    defaultContainedIn,
    defaultContainedInArray,
  };
});

export default getListData;
