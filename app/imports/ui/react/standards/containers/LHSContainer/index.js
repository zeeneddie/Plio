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
import {
  sortArrayByTitlePrefix,
  getSearchMatchText,
  combineObjects,
  pickFrom,
  equals,
  pickC,
  filterC,
  includes,
} from '/imports/api/helpers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';
import { STANDARD_FILTER_MAP } from '/imports/api/constants';
import { canChangeRoles } from '/imports/api/checkers';
import { getCount } from '/imports/api/standards/methods';

const mapStateToProps = combineObjects([
  pickFrom('standards', ['standardsFiltered']),
  pickFrom('collections', ['standards', 'standardsByIds']),
  pickFrom('global', ['searchText', 'filter', 'animating', 'urlItemId', 'userId']),
  pickFrom('organizations', ['organizationId']),
]);

const pickComparableProps = pickC(['_id', 'sectionId', 'typeId', 'isDeleted']);

export default compose(
  connect(mapStateToProps),
  shouldUpdate((props, nextProps) => !!(
    props.searchText !== nextProps.searchText ||
    props.filter !== nextProps.filter ||
    props.animating !== nextProps.animating ||
    props.standards.length !== nextProps.standards.length ||
    !equals(
      pickComparableProps(props.standardsByIds[props.urlItemId]),
      pickComparableProps(nextProps.standardsByIds[nextProps.urlItemId])
    )
  )),
  withHandlers({
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
    getDocsCount: () => ({ organizationId }, cb) => getCount.call({ organizationId }, cb),
  }),
  mapProps((props) => {
    let standards = props.searchText
      ? filterC(std => includes(std._id, props.standardsFiltered), props.standards)
      : props.standards;
    standards = getStandardsByFilter({ standards, filter: props.filter });

    if (props.filter !== STANDARD_FILTER_MAP.DELETED) standards = sortArrayByTitlePrefix(standards);
    else standards = _.sortBy(standards, 'deletedAt').reverse();

    const searchResultsText = getSearchMatchText(props.searchText, standards.length);

    const shouldShowDataImportModal = !standards.length &&
      canChangeRoles(props.userId, props.organizationId);

    return {
      ...props,
      standards,
      searchResultsText,
      shouldShowDataImportModal,
    };
  }),
)(StandardsLHS);
