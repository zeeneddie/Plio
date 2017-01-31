import curry from 'lodash.curry';
import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import { compose, find, propEqId, getC, filter, length, getId } from '/imports/api/helpers';

const getListData = curry((propName, id, items) => {
  const prop = property(propName);
  const eqId = propEqId(id);
  const filterDocs = _id => compose(length, filter(propEqId(_id)), prop);
  const findDoc = compose(find(eqId), prop);

  const containedIn = find(findDoc, items);
  const containedInArray = filter(filterDocs(id), items);
  const selectedDoc = findDoc(containedIn);
  const defaultDoc = getC(`${propName}[0]`, items[0]);
  const defaultContainedIn = _.first(items);
  const defaultContainedInArray = filter(filterDocs(getId(defaultDoc)), items);

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
