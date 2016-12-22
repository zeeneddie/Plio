import store from '/imports/client/store';
import { setSearchText, toggleCollapsed } from '/imports/client/store/actions/globalActions';

export const onToggleCollapse = () => (e, { key, type } = {}) =>
  store.dispatch(toggleCollapsed({ key, type, close: { type } }));

export const onSearchTextClear = onSearchTextChange => props => input => () => {
  if (!props.searchText) return;

  input.focus();

  store.dispatch(setSearchText(''));

  onSearchTextChange(props, input);
};

export const needToSearchPrecisely = (value) => {
  const doubleQuotes = '"';
  const getQuotesIndexes = quotes => [value.indexOf(quotes), value.lastIndexOf(quotes)];
  const doubleQuotesIndexes = getQuotesIndexes(doubleQuotes);
  const isPrecise = (quotesIndexes) =>
    quotesIndexes.length > 1
    && quotesIndexes.every(idx => idx !== -1);

  return isPrecise(doubleQuotesIndexes);
};
