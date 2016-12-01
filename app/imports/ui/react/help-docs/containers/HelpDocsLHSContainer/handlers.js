import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';

import { HelpDocs } from '/imports/share/collections/help-docs';
import {
  setAnimating,
  setSearchText,
  toggleCollapsed,
  addCollapsed,
  chainActions,
} from '/client/redux/actions/globalActions';
import { extractIds } from '/imports/api/helpers';
import { setFilteredHelpDocs } from '/client/redux/actions/helpDocsActions';
import { createHelpSectionItem } from '../../helpers';
import _search_ from '/imports/startup/client/mixins/search';

export const onToggleCollapse = (props) => (e, { key, type }) => {
  props.dispatch(toggleCollapsed({ key, type, close: { type } }));
};

const onChange = _.debounce(({ dispatch, urlItemId }, target) => {
  const value = target.value;
  const fields = [{ name: 'title' }];
  const options = { sort: { title: 1 } };

  // emulate viemodel instance to use viewmodel's mixin
  const context = { searchText: () => value };
  const query = _search_.searchQuery.call(context, 'searchText', fields);

  const helpDocs = HelpDocs.find(query, options).fetch();

  dispatch(batchActions([
    setSearchText(value),
    setFilteredHelpDocs(extractIds(helpDocs)),
    setAnimating(true),
  ]));

  const afterCollapse = () => {
    dispatch(setAnimating(false));
    target.focus();
  };

  if (value) {
    const sectionsToExpand = new Set();
    helpDocs.forEach(help => sectionsToExpand.add(help.sectionId));

    const actions = Array.from(sectionsToExpand).map((sectionId) => {
      const sectionItem = createHelpSectionItem(sectionId);
      return addCollapsed({ ...sectionItem, close: { type: sectionItem.type } });
    });

    dispatch(chainActions(actions)).then(afterCollapse);
  } else {
    const selectedHelp = helpDocs.find(help => help._id === urlItemId);
    const sectionItem = createHelpSectionItem(selectedHelp.sectionId);

    dispatch(addCollapsed({
      ...sectionItem,
      close: { type: sectionItem.type },
    }));

    afterCollapse();
  }
}, 400);

export const onSearchTextChange = props => e => onChange(props, e.target);

export const onClear = props => input => () => {
  if (!props.searchText) {
    return;
  }

  input.focus();
  props.dispatch(setSearchText(''));
  onChange(props, input);
};

export const onModalOpen = () => () => alert('modal open');
