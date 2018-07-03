import { batchActions } from 'redux-batched-actions';
import { map, path } from 'ramda';

import { extractIds } from '/imports/api/helpers';
import {
  expandCollapsedStandards,
  collapseExpandedStandards,
  expandCollapsedStandard,
} from '../../helpers';
import _modal_ from '../../../../../startup/client/mixins/modal';
import {
  setFilteredStandards,
  setInitializing,
} from '../../../../store/actions/standardsActions';
import { onSearchTextClear, onSearch } from '../../../share/LHS/handlers';
import { close } from '../../../../store/actions/modalActions';
import {
  setModalOpenedState,
  setDataImportInProgress,
  setImportedIds,
} from '../../../../store/actions/dataImportActions';
import { goTo } from '../../../../../ui/utils/router';
import { getCount } from '../../../../../api/standards/methods';
import { canChangeRoles } from '../../../../../api/checkers';

const addTypeAbbrs = (standardTypesByIds = {}, standards = []) => map((standard = {}) => {
  const { typeId, uniqueNumber = '' } = standard;
  // allow to search by linked type's abbreviation and/or by unique number
  const typeAbbr = path([typeId, 'abbreviation'], standardTypesByIds);
  const typePrefix = `${typeAbbr}${uniqueNumber}`;
  return {
    ...standard,
    typePrefix,
  };
}, standards);

const getItems = ({ standards, standardTypesByIds }, search) =>
  extractIds(search(
    ['title', 'description', 'status', 'uniqueNumber', 'typePrefix'],
    addTypeAbbrs(standardTypesByIds, standards)),
  );

const getActions = ids => [setFilteredStandards(ids)];

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

export const onModalOpen = props => (e) => {
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

export const onDataImportSuccess = ({ dispatch }) => (res) => {
  let actions = [
    setDataImportInProgress(false),
    setInitializing(true),
  ];

  if (!res || !res.length) return dispatch(batchActions(actions));

  const reducer = (prev, { _id }) => Object.assign(prev, { [_id]: _id });
  const ids = res.reduce(reducer, {});
  const id = ids[Object.keys(ids)[0]];

  if (!id) return false;

  actions = actions.concat([
    setImportedIds(ids),
  ]);

  dispatch(batchActions(actions));

  goTo('standard')({ urlItemId: id });

  expandCollapsedStandard(id);

  return true;
};

export const getDocsCount = () => getCount.call.bind(getCount);

export const onDataImportModalClose = ({ dispatch }) => () => dispatch(setModalOpenedState(false));
