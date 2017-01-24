import curry from 'lodash.curry';
import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import { compose, find, propEqId, getC } from '/imports/api/helpers';

const getListData = curry((propName, id, items) => {
  const findDoc = compose(find(propEqId(id)), property(propName));
  const containedIn = find(findDoc, items);
  return {
    containedIn,
    selectedDoc: findDoc(containedIn),
    defaultDoc: getC(`${propName}[0]`, items[0]),
    defaultContainedIn: _.first(items),
  };
});

export default getListData;
