import { batchActions } from 'redux-batched-actions';
import property from 'lodash.property';

import {
  propEq,
  lengthStandards,
  extractIds,
  compose
} from '/imports/api/helpers';
import { createSectionItem } from '../../helpers';
import { Standards } from '/imports/share/collections/standards';
import _search_ from '/imports/startup/client/mixins/search';
import { setFilteredSections } from '/client/redux/actions/standardsActions';
import {
  setSearchText,
  toggleCollapsed,
  addCollapsed,
  collapseMulti
} from '/client/redux/actions/globalActions';
import { CollectionNames } from '/imports/share/constants';

export const onToggleCollapse = ({ dispatch }) => (e, { key, type } = {}) =>
  dispatch(toggleCollapsed(createSectionItem(key), { type }));

export const onSearchTextChange = _.debounce(({ dispatch, sections, standardId }, value) => {
  const fields = [
    { name: 'title' },
    { name: 'description' },
    { name: 'status' }
  ];
  const query = _search_.searchQuery(value, fields);
  const options = { sort: { title: 1 }, fields: { _id: 1 } };
  const standards = Standards.find(query, options).fetch();
  const mapper = section => ({
    ...section,
    collapsed: false,
    standards: section.standards.filter(standard => extractIds(standards).includes(standard._id))
  });
  const newSections = sections.map(mapper).filter(lengthStandards);
  const current = sections.find(section => section.standards.find(propEq('_id', standardId)));

  const actions = [
    setSearchText(value),
    setFilteredSections(newSections),
  ];

  dispatch(batchActions(actions));

  if (value) {
    dispatch(collapseMulti(
      newSections.map(compose(addCollapsed, createSectionItem, property('_id')))
    ));
  } else {
    dispatch(addCollapsed(
      createSectionItem(current._id),
      { type: CollectionNames.STANDARD_BOOK_SECTIONS }
    ));
  }
}, 400);
