import { _ } from 'meteor/underscore';

import { extractIds, getId } from '/imports/api/helpers';
import {
  expandCollapsedStandards,
  collapseExpandedStandards,
  expandCollapsedStandard,
} from '../../helpers';
import _modal_ from '/imports/startup/client/mixins/modal';
import { setFilteredStandards } from '/imports/client/store/actions/standardsActions';
import { onSearchTextClear, onSearch } from '/imports/ui/react/share/LHS/handlers';
import { close } from '/imports/client/store/actions/modalActions';
import { setModalOpenedState } from '/imports/client/store/actions/dataImportActions';
import { goTo } from '/imports/ui/utils/router';
import { getCount } from '/imports/api/standards/methods';
import { canChangeRoles } from '/imports/api/checkers';

const getItems = ({ standards }, search) =>
  extractIds(search(['title', 'description', 'status'], standards));

const getActions = (ids) => [setFilteredStandards(ids)];

export const onSearchTextChange =
  onSearch(getItems, getActions, expandCollapsedStandards, collapseExpandedStandards);

export const onClear = onSearchTextClear(onSearchTextChange);

export const openDocumentCreationModal = ({ dispatch }) => () => {
  dispatch(close);

  _modal_.modal.open({
    _title: 'Standard',
    template: 'CreateStandard',
    variation: 'save',
  });
};

export const onModalOpen = (props) => (e) => {
  const {
    dispatch,
    filteredStandards,
    userId,
    organizationId,
  } = props;

  dispatch(close);

  // use only filtered standards because search can match no documents
  if (!filteredStandards.length && canChangeRoles(userId, organizationId)) {
    return dispatch(setModalOpenedState(true));
  }

  return openDocumentCreationModal(props)(e);
};

export const onDataImportSuccess = () => (res) => {
  const id = getId(_.first(res));

  if (!id) return;

  goTo('standard')({ urlItemId: id });

  expandCollapsedStandard(id);
};

export const getDocsCount = () => getCount.call.bind(getCount);

export const onDataImportModalClose = ({ dispatch }) => () => dispatch(setModalOpenedState(false));
