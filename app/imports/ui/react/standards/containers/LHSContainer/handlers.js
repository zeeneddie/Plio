import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';

import {
  extractIds,
  looksLikeAPromise,
} from '/imports/api/helpers';
import {
  expandCollapsedStandards,
  collapseExpandedStandards,
} from '../../helpers';
import { Standards } from '/imports/share/collections/standards';
import _search_ from '/imports/startup/client/mixins/search';
import _modal_ from '/imports/startup/client/mixins/modal';
import {
  setFilteredStandards,
} from '/imports/client/store/actions/standardsActions';
import {
  setSearchText,
  setAnimating,
} from '/imports/client/store/actions/globalActions';
import { onSearchTextClear, needToSearchPrecisely } from '/imports/ui/react/share/LHS/handlers';

export const onSearchTextChange = _.debounce(({
  dispatch,
  collapseOnSearch,
}, target) => {
  const value = target.value;
  const fields = [
    { name: 'title' },
    { name: 'description' },
    { name: 'status' },
  ];
  const query = _search_.searchQuery(value, fields, needToSearchPrecisely(value));
  const options = { sort: { title: 1 } };
  const standardsFound = Standards.find(query, options).fetch();
  const standardsFoundIds = extractIds(standardsFound);

  let actions = [
    setSearchText(value),
    setFilteredStandards(standardsFoundIds),
  ];

  if (collapseOnSearch) actions = actions.concat(setAnimating(true));

  dispatch(batchActions(actions));

  if (!collapseOnSearch) return false;

  const finish = () => {
    dispatch(setAnimating(false));
    target.focus();
  };

  const invokeFinish = result => (looksLikeAPromise(result) ? result.then(finish) : finish());

  if (value) {
    return invokeFinish(expandCollapsedStandards(standardsFoundIds));
  }

  return invokeFinish(collapseExpandedStandards());
}, 400);

export const onClear = onSearchTextClear(onSearchTextChange);

export const onModalOpen = () => () => _modal_.modal.open({
  _title: 'Compliance standard',
  template: 'CreateStandard',
  variation: 'save',
});
