import { connect } from 'react-redux';
import { withHandlers } from 'recompose';

import { getIsModalOpened } from '../../../../store/selectors/dataImport';
import { getOrganizationId } from '../../../../store/selectors/organizations';
import {
  getSearchText,
  getFilter,
  getAnimating,
  getUrlItemId,
  getUserId,
} from '../../../../store/selectors/global';
import { getSearchMatchText } from '../../../../../api/helpers';

import { onToggleCollapse } from '../../../share/LHS/handlers';
import StandardsLHS from '../../components/LHS';
import {
  onSearchTextChange,
  onClear,
  onModalOpen,
  onDataImportSuccess,
  getDocsCount,
  onDataImportModalClose,
  openDocumentCreationModal,
} from './handlers';
import {
  getFilteredStandards,
  getSortedStandardsByFilter,
} from '../../../../store/selectors/standards';
import { getStandardTypesByIds } from '../../../../store/selectors/standardTypes';
import { namedCompose } from '../../../helpers';

const mapStateToProps = (state) => {
  const standards = getSortedStandardsByFilter(state);
  const searchText = getSearchText(state);

  return {
    standards,
    searchText,
    standardTypesByIds: getStandardTypesByIds(state),
    filteredStandards: getFilteredStandards(state),
    organizationId: getOrganizationId(state),
    filter: getFilter(state),
    animating: getAnimating(state),
    urlItemId: getUrlItemId(state),
    userId: getUserId(state),
    isDataImportModalOpened: getIsModalOpened(state),
    searchResultsText: getSearchMatchText(searchText, standards.length),
  };
};

export default namedCompose('StandardsLHSContainer')(
  connect(mapStateToProps),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
    getDocsCount,
    onDataImportSuccess,
    onDataImportModalClose,
    openDocumentCreationModal,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
)(StandardsLHS);
