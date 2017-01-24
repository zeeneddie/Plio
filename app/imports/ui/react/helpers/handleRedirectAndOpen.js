import curry from 'lodash.curry';

import { addCollapsed } from '/imports/client/store/actions/globalActions';
import handleListRedirect from './handleListRedirect';
import { getState } from '/imports/client/store';

const handleOpen = (createItem, dispatch, containedIn, defaultContainedIn) => {
  const parentItem = containedIn || defaultContainedIn;
  const item = createItem(parentItem);

  if (!item || !item.key) return false;

  return dispatch(addCollapsed({ ...item, close: { type: item.type } }));
};

const handleRedirectAndOpen = (getListData, goToDoc, goToDocs, createItem, items, childItemsByIds, {
  redirect = handleListRedirect,
  open = handleOpen,
  searchText,
  dispatch,
}) => setTimeout(() => {
  const { global: { urlItemId } } = getState();
  const {
    containedIn,
    defaultContainedIn,
    selectedDoc,
    defaultDoc,
  } = getListData(urlItemId, items);

  // if the document does not exist, do not expand.
  // show message that the document does not exist instead.
  if (urlItemId && !childItemsByIds[urlItemId]) return;

  // redirect to the selected or default document
  // and expand the collapse which contains that document
  redirect(goToDoc, goToDocs, selectedDoc, defaultDoc);
  if (!searchText) open(createItem, dispatch, containedIn, defaultContainedIn);
}, 0);

export default curry(handleRedirectAndOpen);
