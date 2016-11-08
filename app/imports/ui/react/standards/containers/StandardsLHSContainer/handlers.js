import { batchActions } from 'redux-batched-actions';
import { _ } from 'meteor/underscore';

import {
  lengthStandards,
  extractIds,
  getId,
  propEq,
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
import {
  setFilteredSections,
  setFilteredTypes,
} from '/client/redux/actions/standardsActions';
import {
  setSearchText,
  toggleCollapsed,
  collapseMulti,
  addCollapsed,
} from '/client/redux/actions/globalActions';
import { CollectionNames } from '/imports/share/constants';
import { mapTypes } from '/client/redux/lib/standardsHelpers';

const onToggle = fn => ({ dispatch }) => (e, { key, type } = {}) =>
  dispatch(toggleCollapsed({ ...fn(key), close: { type } }));

export const onSectionToggleCollapse = onToggle(createSectionItem);

export const onTypeToggleCollapse = onToggle(createTypeItem);

export const onSearchTextChange = _.debounce(({
  dispatch,
  sections,
  types,
  standardId,
  filter,
  collapsed,
 }, value) => {
  const fields = [
    { name: 'title' },
    { name: 'description' },
    { name: 'status' },
  ];
  const query = _search_.searchQuery(value, fields);
  const options = { sort: { title: 1 }, fields: { _id: 1 } };
  const standards = Standards.find(query, options).fetch();
  const mapper = section => ({
    ...section,
    standards: section.standards.filter(standard => extractIds(standards).includes(standard._id)),
  });
  const newSections = sections.map(mapper).filter(lengthStandards);
  const newTypes = mapTypes({ sections: newSections }, types);

  const actions = [
    setSearchText(value),
    setFilteredSections(newSections),
    setFilteredTypes(newTypes),
  ];

  dispatch(batchActions(actions));

  if (value) {
    const filterCollapsed = array => array.filter(({ _id }) =>
      !collapsed.find(propEq('key', _id)));
    // expand sections and types with found items one by one
    const typesToCollapse = filterCollapsed(newTypes).map(addCollapsedType);
    const sectionsToCollapse = filterCollapsed(newSections).map(addCollapsedSection);
    const itemsToCollapse = filter === 1
      ? sectionsToCollapse
      : typesToCollapse.concat(sectionsToCollapse);

    dispatch(collapseMulti(itemsToCollapse));
  } else {
    // expand section and types with currently selected standard and close others
    const selectedType = types.find(findSelectedSection(standardId));
    const selectedSection = sections.find(findSelectedStandard(standardId));
    const selectedTypeItem = createTypeItem(getId(selectedType));
    const selectedSectionItem = createSectionItem(getId(selectedSection));
    const addClose = item => ({
      ...item,
      close: { type: item.type },
    });
    const typeToCollapse = addCollapsed(addClose(selectedTypeItem));
    const sectionToCollapse = addCollapsed(addClose(selectedSectionItem));

    if (filter === 1) {
      return dispatch(sectionToCollapse);
    }

    dispatch(collapseMulti([typeToCollapse, sectionToCollapse]));
  }
}, 400);
