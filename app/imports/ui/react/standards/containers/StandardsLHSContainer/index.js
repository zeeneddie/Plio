import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withProps } from 'recompose';
import property from 'lodash.property';

import { flattenMapStandards, propEq, not } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import {
  onSectionToggleCollapse,
  onTypeToggleCollapse,
  onSearchTextChange,
  onClear,
} from './handlers';

const mapStateToProps = ({
  standards: {
    sections,
    types,
    sectionsFiltered,
    typesFiltered,
    standardId,
    standards,
    standardsFiltered,
  },
  global: { searchText, filter, collapsed, animating },
  organizations: { orgSerialNumber },
}) => ({
  standards,
  standardsFiltered,
  sections,
  types,
  sectionsFiltered,
  searchText,
  orgSerialNumber,
  filter,
  collapsed,
  standardId,
  typesFiltered,
  animating,
});

export default compose(
  connect(mapStateToProps),
  withProps(props => ({ collapseOnSearch: props.filter !== 3 })),
  withHandlers({
    onSectionToggleCollapse,
    onTypeToggleCollapse,
    onClear,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps(props => {
    const standardsOrFiltered = props.searchText ? props.standardsFiltered : props.standards;
    const standards = props.filter === 3
      ? standardsOrFiltered.filter(propEq('isDeleted', true))
      : standardsOrFiltered.filter(compose(not, property('isDeleted')));

    return {
      ...props,
      standards,
      shouldCollapseOnMount: true,
      sections: props.searchText ? props.sectionsFiltered : props.sections,
      types: props.searchText ? props.typesFiltered : props.types,
      searchResultsText: props.searchText
        ? `${standards.length} matching results`
        : '',
    };
  })
)(StandardsLHS);
