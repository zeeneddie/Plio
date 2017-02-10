import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, shouldUpdate } from 'recompose';
import { _ } from 'meteor/underscore';

import StandardsLHS from '../../components/LHS';
import {
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { getStandardsByFilter } from '../../helpers';
import { sortArrayByTitlePrefix, pickC, notEquals } from '/imports/api/helpers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';

const mapStateToProps = ({
  standards: { standardsFiltered },
  collections: { standards },
  global: {
    searchText,
    filter,
    animating,
    urlItemId,
  },
}) => ({
  standardsFiltered,
  searchText,
  filter,
  animating,
  urlItemId,
  standards,
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps(props => ({
    ...props,
    standards: props.standards.map(pickC([
      '_id',
      'sectionId',
      'typeId',
      'titlePrefix',
      'isDeleted',
      'deletedBy',
      'deletedAt',
    ])),
  })),
  shouldUpdate((props, nextProps) => !!(
    props.searchText !== nextProps.searchText ||
    props.filter !== nextProps.filter ||
    props.animating !== nextProps.animating ||
    notEquals(props.standards, nextProps.standards)
  )),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
  }),
  mapProps((props) => {
    let standards = props.searchText
      ? props.standards.filter(standard => props.standardsFiltered.includes(standard._id))
      : props.standards;
    standards = getStandardsByFilter({ standards, filter: props.filter });

    if (props.filter !== STANDARD_FILTER_MAP.DELETED) standards = sortArrayByTitlePrefix(standards);
    else standards = _.sortBy(standards, 'deletedAt').reverse();

    const searchResultsText = props.searchText ? `${standards.length} matching results` : '';

    return {
      ...props,
      standards,
      searchResultsText,
    };
  }),
)(StandardsLHS);
