import { _ } from 'meteor/underscore';

import { extractIds } from '/imports/api/helpers';
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

export const onModalOpen = ({ dispatch, filteredStandards, userId, organizationId }) => () => {
  dispatch(close);

  // TODO: request doc count from the server

  // if (!filteredStandards.length) {
    // request data => decide to open modal
  // } else // open normal modal

  // use only filtered standards because search can match no documents
  if (!filteredStandards.length && canChangeRoles(userId, organizationId)) {
    return dispatch(setModalOpenedState(true));
  }

  return _modal_.modal.open({
    _title: 'Standard',
    template: 'CreateStandard',
    variation: 'save',
  });
};

export const onDataImportSuccess = () => (ids = []) => {
  const id = _.first(ids);

  goTo('standard')({ urlItemId: id });

  expandCollapsedStandard(id);
};

export const getDocsCount = () => getCount.call.bind(getCount);

export const onDataImportModalClose = ({ dispatch }) => () => dispatch(setModalOpenedState(false));
