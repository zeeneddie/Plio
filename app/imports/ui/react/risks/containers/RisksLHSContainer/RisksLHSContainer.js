import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, shouldUpdate } from 'recompose';

import RiskLHS from '../../components/LHS';
import {
  onSearchTextChange,
  onClear,
  onModalOpen,
} from './handlers';
import { getRisksByFilter } from '../../helpers';
import { sortArrayByTitlePrefix, pickC, notEquals } from '/imports/api/helpers';
import { onToggleCollapse } from '/imports/ui/react/share/LHS/handlers';

const mapStateToProps = ({
  risks: { risksFiltered },
  collections: { risks },
  global: {
    searchText,
    filter,
    animating,
    urlItemId,
  },
}) => ({
  risksFiltered,
  searchText,
  filter,
  animating,
  urlItemId,
  risks,
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    onSearchTextChange: props => e => onSearchTextChange(props, e.target),
  }),
  mapProps(props => ({
    ...props,
    risks: props.risks.map(pickC([
      '_id',
      'departmentsIds',
      'typeId',
      'titlePrefix',
      'status',
      'isDeleted',
    ])),
  })),
  shouldUpdate((props, nextProps) => Boolean(
    props.searchText !== nextProps.searchText ||
    props.filter !== nextProps.filter ||
    props.animating !== nextProps.animating ||
    notEquals(props.risks, nextProps.risks)
  )),
  withHandlers({
    onToggleCollapse,
    onClear,
    onModalOpen,
  }),
  mapProps((props) => {
    let risks = props.searchText
      ? props.risks.filter(risk => props.risksFiltered.includes(risk._id))
      : props.risks;
    risks = getRisksByFilter({ risks, filter: props.filter });
    risks = sortArrayByTitlePrefix(risks);

    const searchResultsText = props.searchText ? `${risks.length} matching results` : '';

    return {
      ...props,
      risks,
      searchResultsText,
    };
  }),
)(RiskLHS);
