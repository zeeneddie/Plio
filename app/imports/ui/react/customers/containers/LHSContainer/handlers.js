import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';

import { Organizations } from '/imports/share/collections/organizations';
import { setFilteredOrganizations } from '/client/redux/actions/customersActions';
import {
  setSearchText,
  setAnimating,
} from '/client/redux/actions/globalActions';
import {
  extractIds,
  looksLikeAPromise,
} from '/imports/api/helpers';
import {
  expandCollapsedCustomers,
  collapseExpandedCustomers,
} from '../../helpers';
import _search_ from '/imports/startup/client/mixins/search';
import { onSearchTextClear } from '/imports/ui/react/share/LHS/handlers';

export const onSearchTextChange = _.debounce(({
  dispatch,
  urlItemId,
  organizations,
}, target) => {
  const value = target.value;
  const fields = [{ name: 'name' }];
  const query = _search_.searchQuery(value, fields);
  const options = { sort: { name: 1 } };

  const organizationsFound = Organizations.find(query, options).fetch();
  const organizationsFoundIds = extractIds(organizationsFound);

  dispatch(batchActions([
    setSearchText(value),
    setFilteredOrganizations(organizationsFoundIds),
    setAnimating(true),
  ]));

  const finish = () => {
    dispatch(setAnimating(false));
    target.focus();
  };

  const invokeFinish = result => (looksLikeAPromise(result) ? result.then(finish) : finish());

  if (value) {
    return invokeFinish(expandCollapsedCustomers(organizationsFoundIds));
  }

  return invokeFinish(collapseExpandedCustomers());
}, 400);

export const onClear = onSearchTextClear(onSearchTextChange);
