import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps } from 'recompose';
import { batchActions } from 'redux-batched-actions';
import property from 'lodash.property';

import { propEq, lengthStandards, extractIds, flattenMapStandards } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import {
  toggleSectionCollapsed,
  setFilteredSections
} from '/client/redux/actions/standardsActions';
import { setSearchText } from '/client/redux/actions/globalActions';
import _search_ from '/imports/startup/client/mixins/search';
import { Standards } from '/imports/share/collections/standards';

const mapStateToProps = ({
  standards: { sections, sectionsFiltered },
  global: { searchText }
}) => ({ sections, sectionsFiltered, searchText });

const onToggleCollapse = ({ dispatch, sections }) => (e, props) => {
  const index = sections.findIndex(propEq('_id', props.item._id));

  if (index === -1) return;

  dispatch(toggleSectionCollapsed(index));
};

const onSearchTextChange = _.debounce(({ dispatch, sections }, value) => {
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

  const actions = [
    setSearchText(value),
    setFilteredSections(newSections)
  ];

  dispatch(batchActions(actions));
}, 400);

export default compose(
  withHandlers({
    onToggleCollapse,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target.value)
  }),
  connect(mapStateToProps),
  mapProps(props => ({
    ...props,
    sections: props.searchText ? props.sectionsFiltered : props.sections,
    searchResultsText: props.searchText
      ? `${flattenMapStandards(props.sectionsFiltered).length} matching results`
      : ''
  })),
)(StandardsLHS);
