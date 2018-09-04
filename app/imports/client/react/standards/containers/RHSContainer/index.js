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
  anyPass,
} from 'ramda';
import { lenses, getStandardsLength } from 'plio-util';

import StandardsRHS from '../../components/RHS';
import {
  getIsFullScreenMode,
  getIsCardReady,
  getUrlItemId,
  getSearchText,
} from '../../../../store/selectors/global';
import {
  getStandardsByIds,
  getStandardsFiltered,
  getFilteredStandards,
  getSelectedStandard,
} from '../../../../store/selectors/standards';
import { namedCompose } from '../../../helpers';

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

const mapStateToProps = (state) => {
  const standard = getSelectedStandard(state);
  const isCardReady = getIsCardReady(state);
  const standards = getFilteredStandards(state);
  const isReady = !!(isCardReady && standards.length && standard);
  const hasDocxAttachment = anyPass([
    view(lenses.source1.htmlUrl),
    view(lenses.source2.htmlUrl),
  ])(standard);

  return {
    standard,
    isReady,
    hasDocxAttachment,
    standards,
    isCardReady,
    standardsByIds: getStandardsByIds(state),
    standardsFiltered: getStandardsFiltered(state),
    urlItemId: getUrlItemId(state),
    isFullScreenMode: getIsFullScreenMode(state),
    searchText: getSearchText(state),
  };
};

export default namedCompose('StandardsRHSContainer')(
  connect(mapStateToProps),
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
