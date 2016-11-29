import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withProps, pure } from 'recompose';

import StandardsLHS from '../../components/StandardsLHS';
import {
  onSectionToggleCollapse,
  onTypeToggleCollapse,
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { initSections, initTypes } from '/client/redux/lib/standardsHelpers';
import { getStandardsByFilter } from '../../helpers';

const mapStateToProps = ({
  standards: {
    sections,
    types,
    standards,
    standardsFiltered,
  },
  discussion: {
    isDiscussionOpened,
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
  isDiscussionOpened,
  standards,
  standardsFiltered,
  sections,
  types,
  searchText,
  orgSerialNumber,
  filter,
  collapsed,
  urlItemId,
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
    standards = getStandardsByFilter({ standards, filter: props.filter });
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
