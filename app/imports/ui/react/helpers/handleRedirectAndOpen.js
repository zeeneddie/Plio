import curry from 'lodash.curry';
import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import { addCollapsed, chainActions } from '/imports/client/store/actions/globalActions';
import handleListRedirect from './handleListRedirect';
import { getState } from '/imports/client/store';
import { propEq, assoc, map, filter, compose, some } from '/imports/api/helpers';

const handleOpen = (createItem, dispatch, containedInArray, defaultContainedInArray) => {
  const parentItems = containedInArray.length ? containedInArray : defaultContainedInArray;
  const items = compose(filter(property('key')), map(createItem))(parentItems);

  if (!items.length) return false;

  const close = some([
    compose(propEq('type', _.first(items)), property('type')),
    property(find(propEq('key'), items), property('key')),
  ]);

  const withCollapsedAndClosed = compose(assoc('close', close), addCollapsed);

  const actions = map(withCollapsedAndClosed, items);

  console.log(actions);

  return dispatch(chainActions(actions));
};

const handleRedirectAndOpen = (getListData, goToDoc, goToDocs, createItem, items, childItemsByIds, {
  redirect = handleListRedirect,
  open = handleOpen,
  searchText,
  dispatch,
}) => setTimeout(() => {
  const { global: { urlItemId } } = getState();
  const {
    containedInArray,
    defaultContainedInArray,
    selectedDoc,
    defaultDoc,
    // containedIn,
    // defaultContainedIn,
  } = getListData(urlItemId, items);

  // if the document does not exist, do not expand.
  // show message that the document does not exist instead.
  if (urlItemId && !childItemsByIds[urlItemId]) return;

  // redirect to the selected or default document
  // and expand the collapse which contains that document
  redirect(goToDoc, goToDocs, selectedDoc, defaultDoc);
  if (!searchText) open(createItem, dispatch, containedInArray, defaultContainedInArray);
}, 0);

export default curry(handleRedirectAndOpen);
