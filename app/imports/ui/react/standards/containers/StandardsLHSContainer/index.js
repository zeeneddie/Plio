import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withProps, withState } from 'recompose';

import { flattenMapStandards } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import { onToggleCollapse, onSearchTextChange } from './handlers';

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
