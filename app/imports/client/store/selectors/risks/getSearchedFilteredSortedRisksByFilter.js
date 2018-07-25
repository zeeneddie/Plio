import { mergeDeepLeft, compose } from 'ramda';

import getSortedRisksByFilter from './getSortedRisksByFilter';
import getFilteredRisks from './getFilteredRisks';
import getSearchedRisks from './getSearchedRisks';

const getNextState = (risks, state) => mergeDeepLeft({
  collections: { risks },
}, state);

export default state => compose(
  getSortedRisksByFilter,
  filtered => getNextState(filtered, state),
  getFilteredRisks,
  searched => getNextState(searched, state),
  getSearchedRisks,
)(state);
