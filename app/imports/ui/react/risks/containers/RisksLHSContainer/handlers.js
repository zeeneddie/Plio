import { extractIds } from '/imports/api/helpers';
import {
  expandCollapsedStandards,
  collapseExpandedStandards,
} from '../../helpers';
import _modal_ from '/imports/startup/client/mixins/modal';
import {
  setFilteredStandards,
} from '/imports/client/store/actions/standardsActions';
import { onSearchTextClear, onSearch } from '/imports/ui/react/share/LHS/handlers';

const getItems = ({ risks }, search) =>
  extractIds(search(['title', 'description', 'status'], risks));

const getActions = (ids) => [setFilteredStandards(ids)];

export const onSearchTextChange =
  onSearch(getItems, getActions, expandCollapsedStandards, collapseExpandedStandards);

export const onClear = onSearchTextClear(onSearchTextChange);

export const onModalOpen = () => () => _modal_.modal.open({
  _title: 'Risk',
  template: 'CreateRisk',
  variation: 'save',
});
