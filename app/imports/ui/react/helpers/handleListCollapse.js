import property from 'lodash.property';

import {
  mapC,
  filterC,
  compose,
  some,
  propEqType,
  propEqKey,
  not,
} from '/imports/api/helpers';
import { addCollapsedWithClose, chainActions } from '/imports/client/store/actions/globalActions';


const handleListCollapse = (createItem, dispatch, containedInArray, defaultContainedInArray) => {
  const parentItems = containedInArray.length ? containedInArray : defaultContainedInArray;
  const items = compose(filterC(property('key')), mapC(createItem))(parentItems);

  if (!items.length) return false;

  // close items that are not the current item's type or that are not contained in 'items' array
    // item => collapsed[item] => Bool
  const close = ({ type }) => some([
    ({ key }) => find(propEqKey(key), items),
    compose(not, propEqType(type)),
  ]);

  const actions = mapC(addCollapsedWithClose(close), items);

  return dispatch(chainActions(actions));
};

export default handleListCollapse;
