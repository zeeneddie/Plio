import { _ } from 'meteor/underscore';
import { batchActions } from 'redux-batched-actions';

import store from '/imports/client/store';
import {
  setSearchText,
  toggleCollapsed,
  setAnimating,
} from '/imports/client/store/actions/globalActions';
import {
  looksLikeAPromise,
  createSearchRegex,
  searchByRegex,
} from '/imports/api/helpers';

export const onToggleCollapse = () => (e, { key, type } = {}) =>
  store.dispatch(toggleCollapsed({ key, type, close: { type } }));

export const needToSearchPrecisely = (value) => {
  const doubleQuotes = '"';
  const getQuotesIndexes = quotes => [value.indexOf(quotes), value.lastIndexOf(quotes)];
  const doubleQuotesIndexes = getQuotesIndexes(doubleQuotes);
  const isPrecise = quotesIndexes =>
    quotesIndexes.length > 1
    && quotesIndexes.every(idx => idx !== -1);

  return isPrecise(doubleQuotesIndexes);
};

export const onSearch = (getItems, getActions, expand, collapse) =>
  _.debounce(({ ...props }, target) => {
    const value = target.value;
    const regex = createSearchRegex(value, needToSearchPrecisely(value));
    const result = getItems(props, searchByRegex(regex));
    const actions = getActions(result);

    store.dispatch(batchActions([
      ...actions,
      setSearchText(value),
      setAnimating(true),
    ]));

    const finish = () => {
      store.dispatch(setAnimating(false));
      target.focus();
    };

    const invokeFinish = res => (looksLikeAPromise(res) ? res.then(finish) : finish());

    if (value) return invokeFinish(expand(result));

    return invokeFinish(collapse(result));
  }, 400);

export const onSearchTextClear = onSearchTextChange => props => input => () => {
  if (!props.searchText) return;

  input.focus();

  store.dispatch(setSearchText(''));

  onSearchTextChange(props, input);
};
