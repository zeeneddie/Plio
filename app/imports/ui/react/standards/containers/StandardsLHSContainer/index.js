import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withProps, pure } from 'recompose';
import property from 'lodash.property';

import { propEq, not } from '/imports/api/helpers';
import StandardsLHS from '../../components/StandardsLHS';
import {
  onSectionToggleCollapse,
  onTypeToggleCollapse,
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { initSections, initTypes } from '/client/redux/lib/standardsHelpers';

const mapStateToProps = ({
  standards: {
    sections,
    types,
    sectionsFiltered,
    typesFiltered,
    standards,
    standardsFiltered,
  },
  global: {
    searchText,
    filter,
    collapsed,
    animating,
    urlItemId,
    userId,
  },
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
  urlItemId,
  typesFiltered,
  animating,
  userId,
});

export default compose(
  pure,
  connect(mapStateToProps),
  withProps(props => ({ collapseOnSearch: props.filter !== 3 })),
  withHandlers({
    onSectionToggleCollapse,
    onTypeToggleCollapse,
    onClear,
    onModalOpen,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps(props => {
    let standards = props.searchText
      ? props.standards.filter(standard => props.standardsFiltered.includes(standard._id))
      : props.standards;
    standards = props.filter === 3
      ? standards.filter(propEq('isDeleted', true))
      : standards.filter(compose(not, property('isDeleted')));
    const sections = props.searchText
      ? initSections({ standards, sections: props.sections, types: props.types })
      : props.sections;
    const types = props.searchText
      ? initTypes({ sections, types: props.types })
      : props.types;

    return {
      ...props,
      standards,
      sections,
      types,
      searchResultsText: props.searchText
        ? `${standards.length} matching results`
        : '',
    };
  }),
)(StandardsLHS);
