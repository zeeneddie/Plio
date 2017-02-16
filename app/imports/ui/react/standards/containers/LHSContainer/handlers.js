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
import { goTo } from '/imports/ui/utils/router';
import { getCount } from '/imports/api/standards/methods';

const getItems = ({ standards }, search) =>
  extractIds(search(['title', 'description', 'status'], standards));

const getActions = (ids) => [setFilteredStandards(ids)];

export const onSearchTextChange =
  onSearch(getItems, getActions, expandCollapsedStandards, collapseExpandedStandards);

export const onClear = onSearchTextClear(onSearchTextChange);

export const onModalOpen = ({ dispatch }) => () => {
  dispatch(close);

  _modal_.modal.open({
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
