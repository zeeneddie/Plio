import {
  compose,
  branch,
  renderComponent,
} from 'recompose';
import { connect } from 'react-redux';
import {
  length,
  view,
  allPass,
  complement,
  identity,
} from 'ramda';

import StandardsRHS from '../../components/RHS';
import { getRHS } from '../../../../../client/store/selectors/standards';
import lenses from '../../../../../client/store/selectors/lenses';

// ({ standards: Array }) => Boolean
const getStandardsLength = compose(length, view(lenses.standards));
// ({ searchText: String, standardsFiltered: Array }) => Boolean
const noResultsPred = allPass([
  view(lenses.searchText),
  compose(complement(length), view(lenses.standardsFiltered)),
]);
// ({ isCardReady: Boolean, urlItemId: String, standard: Object }) => Boolean
const notExistPred = allPass([
  view(lenses.isCardReady),
  view(lenses.urlItemId),
  complement(view)(lenses.standard),
]);

export default compose(
  connect(getRHS),
  branch(
    getStandardsLength,
    identity,
    renderComponent(StandardsRHS.NotFound),
  ),
  branch(
    noResultsPred,
    renderComponent(StandardsRHS.NoResults),
    identity,
  ),
  branch(
    notExistPred,
    renderComponent(StandardsRHS.NotExist),
    identity,
  ),
)(StandardsRHS);
