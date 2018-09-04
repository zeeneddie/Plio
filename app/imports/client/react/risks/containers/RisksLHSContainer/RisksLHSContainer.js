import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import RiskLHS from '../../components/LHS';
import {
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { onToggleCollapse } from '../../../share/LHS/handlers';
import { getSearchMatchText } from '../../../../../api/helpers';
import {
  getRisksFiltered,
  getSearchedFilteredSortedRisksByFilter,
} from '../../../../store/selectors/risks';
import {
  getFilter,
  getSearchText,
  getAnimating,
  getUrlItemId,
} from '../../../../store/selectors/global';

const mapStateToProps = (state) => {
  const searchText = getSearchText(state);
  const risks = getSearchedFilteredSortedRisksByFilter(state);
  const searchResultsText = getSearchMatchText(searchText, risks.length);

  return {
    risks,
    searchText,
    searchResultsText,
    risksFiltered: getRisksFiltered(state),
    filter: getFilter(state),
    animating: getAnimating(state),
    urlItemId: getUrlItemId(state),
  };
};
export default compose(
  connect(mapStateToProps),
  withHandlers({
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
  }),
)(RiskLHS);
