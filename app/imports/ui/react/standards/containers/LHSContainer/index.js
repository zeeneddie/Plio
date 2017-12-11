import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

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
import { getLHS } from '../../../../../client/store/selectors/standards';

export default compose(
  connect(getLHS),
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
