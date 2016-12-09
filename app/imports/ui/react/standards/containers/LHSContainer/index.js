import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, shouldUpdate } from 'recompose';

import StandardsLHS from '../../components/LHS';
import {
  onSectionToggleCollapse,
  onTypeToggleCollapse,
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { getStandardsByFilter } from '../../helpers';
import { sortArrayByTitlePrefix, pickC, notEquals } from '/imports/api/helpers';

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
  mapProps(props => ({
    ...props,
    collapseOnSearch: props.filter !== 3,
    standards: props.standards.map(pickC([
      '_id',
      'sectionId',
      'typeId',
      'titlePrefix',
      'isDeleted',
    ])),
  })),
  shouldUpdate((props, nextProps) => !!(
    props.searchText !== nextProps.searchText ||
    props.filter !== nextProps.filter ||
    props.animating !== nextProps.animating ||
    notEquals(props.standards, nextProps.standards)
  )),
  withHandlers({
    onSectionToggleCollapse,
    onTypeToggleCollapse,
    onClear,
    onModalOpen,
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps((props) => {
    let standards = props.searchText
      ? props.standards.filter(standard => props.standardsFiltered.includes(standard._id))
      : props.standards;
    standards = getStandardsByFilter({ standards, filter: props.filter });
    standards = sortArrayByTitlePrefix(standards);
    return {
      ...props,
      standards,
    };
  }),
)(StandardsLHS);
