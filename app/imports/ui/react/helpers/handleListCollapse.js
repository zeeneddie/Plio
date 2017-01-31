import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import { propEq, assoc, map, filter, compose, some } from '/imports/api/helpers';
import { addCollapsed, chainActions } from '/imports/client/store/actions/globalActions';


const handleListCollapse = (createItem, dispatch, containedInArray, defaultContainedInArray) => {
  const parentItems = containedInArray.length ? containedInArray : defaultContainedInArray;
  const items = compose(filter(property('key')), map(createItem))(parentItems);

  if (!items.length) return false;

  const close = some([
    compose(propEq('type', _.first(items)), property('type')),
    property(find(propEq('key'), items), property('key')),
  ]);

  const withCollapsedAndClosed = compose(assoc('close', close), addCollapsed);

  const actions = map(withCollapsedAndClosed, items);

  return dispatch(chainActions(actions));
};

export default handleListCollapse;
