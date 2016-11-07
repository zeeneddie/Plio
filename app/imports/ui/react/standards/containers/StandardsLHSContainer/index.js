import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withProps, withState } from 'recompose';
import { batchActions } from 'redux-batched-actions';
import property from 'lodash.property';

import {
  propEq,
  lengthStandards,
  extractIds,
  flattenMapStandards,
  not,
  assoc
} from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import {
  toggleSectionCollapsed,
  setFilteredSections
} from '/client/redux/actions/standardsActions';
import { setSearchText, toggleCollapsed, addCollapsed } from '/client/redux/actions/globalActions';
import _search_ from '/imports/startup/client/mixins/search';
import { Standards } from '/imports/share/collections/standards';
import { createSectionItem } from '../../helpers';

const mapStateToProps = ({
  standards: {
    sections,
    types,
    sectionsFiltered,
    standardId
  },
  global: { searchText, filter, collapsed },
  organizations: { orgSerialNumber }
}) => ({
  sections,
  types,
  sectionsFiltered,
  searchText,
  orgSerialNumber,
  filter,
  collapsed,
  standardId
});

const onToggleCollapse = ({ dispatch }) => (e, { key, type } = {}) =>
  dispatch(toggleCollapsed(createSectionItem(key), { type }));

const onSearchTextChange = _.debounce(({ dispatch, sections, standardId }, value) => {
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
  const collapses = !!value
    ? newSections.map(section => addCollapsed(createSectionItem(section._id)))
    : [addCollapsed(createSectionItem(current._id), { type: 'StandardsBookSections' })];

  const actions = [
    setSearchText(value),
    setFilteredSections(newSections),
    ...collapses
  ];

  dispatch(batchActions(actions));
}, 400);

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onToggleCollapse,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target.value),
  }),
  mapProps(props => ({
    ...props,
    sections: props.searchText ? props.sectionsFiltered : props.sections,
    searchResultsText: props.searchText
      ? `${flattenMapStandards(props.sectionsFiltered).length} matching results`
      : ''
  }))
)(StandardsLHS);
