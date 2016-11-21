import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';

import {
  lengthStandards,
  extractIds,
  getId,
  propEq,
  propEqId,
} from '/imports/api/helpers';
import {
  createSectionItem,
  createTypeItem,
  findSelectedSection,
  findSelectedStandard,
  addCollapsedType,
  addCollapsedSection,
} from '../../helpers';
import { Standards } from '/imports/share/collections/standards';
import _search_ from '/imports/startup/client/mixins/search';
import _modal_ from '/imports/startup/client/mixins/modal';
import {
  setFilteredSections,
  setFilteredTypes,
  setFilteredStandards,
} from '/client/redux/actions/standardsActions';
import {
  setSearchText,
  toggleCollapsed,
  chainActions,
  addCollapsed,
  setAnimating,
} from '/client/redux/actions/globalActions';
import { initTypes, initSections } from '/client/redux/lib/standardsHelpers';

const onToggle = fn => ({ dispatch }) => (e, { key, type } = {}) =>
  dispatch(toggleCollapsed({ ...fn(key), close: { type } }));

export const onSectionToggleCollapse = onToggle(createSectionItem);

export const onTypeToggleCollapse = onToggle(createTypeItem);

export const onSearchTextChange = _.debounce(({
  dispatch,
  sections,
  types,
  standards,
  urlItemId,
  filter,
  collapsed,
  collapseOnSearch,
}, target) => {
  const value = target.value;
  const fields = [
    { name: 'title' },
    { name: 'description' },
    { name: 'status' },
  ];
  const query = _search_.searchQuery(value, fields);
  const options = { sort: { title: 1 } };
  const standardsFound = Standards.find(query, options).fetch();
  const newSections = initSections({
    sections,
    types,
    standards: standards.filter(standard => standardsFound.find(propEqId(standard._id))),
  });
  const newTypes = initTypes({ sections: newSections, types });
  const newStandards = standards.filter(standard =>
    extractIds(standardsFound).includes(standard._id));

  let actions = [
    setSearchText(value),
    setFilteredSections(extractIds(newSections)),
    setFilteredTypes(extractIds(newTypes)),
    setFilteredStandards(extractIds(newStandards)),
  ];

  if (collapseOnSearch) actions = actions.concat(setAnimating(true));

  dispatch(batchActions(actions));

  if (!collapseOnSearch) return;

  const finish = () => {
    dispatch(setAnimating(false));
    target.focus();
  };

  if (value) {
    const filterCollapsed = array => array.filter(({ _id }) =>
      !collapsed.find(propEq('key', _id)));
    // expand sections and types with found items one by one
    const typesToCollapse = filterCollapsed(newTypes).map(addCollapsedType);
    const sectionsToCollapse = filterCollapsed(newSections).map(addCollapsedSection);
    const itemsToCollapse = filter === 1
      ? sectionsToCollapse
      : typesToCollapse.concat(sectionsToCollapse);

    dispatch(chainActions(itemsToCollapse)).then(finish);
  } else {
    // expand section and types with currently selected standard and close others
    const selectedType = types.find(findSelectedSection(urlItemId));
    const selectedSection = sections.find(findSelectedStandard(urlItemId));
    const selectedTypeItem = createTypeItem(getId(selectedType));
    const selectedSectionItem = createSectionItem(getId(selectedSection));
    const addClose = item => ({
      ...item,
      close: { type: item.type },
    });
    const typeToCollapse = addCollapsed(addClose(selectedTypeItem));
    const sectionToCollapse = addCollapsed(addClose(selectedSectionItem));

    if (filter === 1) {
      dispatch(sectionToCollapse);
      finish();
    }

    dispatch(chainActions([typeToCollapse, sectionToCollapse]))
      .then(finish);
  }
}, 400);

export const onClear = props => input => () => {
  if (!props.searchText) return;

  input.value = '';
  input.focus();

  props.dispatch(setSearchText(''));

  onSearchTextChange(props, input);
};

export const onModalOpen = () => () => _modal_.modal.open({
  _title: 'Compliance standard',
  template: 'CreateStandard',
  variation: 'save',
});
