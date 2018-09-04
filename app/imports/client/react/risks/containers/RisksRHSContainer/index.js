import {
  compose,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';
import { prop } from 'ramda';

import {
  notEquals,
  omitC,
  identity,
} from '/imports/api/helpers';
import RisksRHS from '../../components/RHS';
import {
  getIsFullScreenMode,
  getIsCardReady,
  getUrlItemId,
  getFilter,
} from '../../../../store/selectors/global';
import { getFilteredRisks, getSelectedRisk } from '../../../../store/selectors/risks';

const mapStateToProps = (state) => {
  const risk = getSelectedRisk(state);
  const risks = getFilteredRisks(state);
  const isCardReady = getIsCardReady(state);
  const urlItemId = getUrlItemId(state);
  const risksLength = risks.length;
  const doesNotExist = isCardReady && urlItemId && !risk;

  return {
    risk,
    isCardReady,
    risksLength,
    urlItemId,
    doesNotExist,
    isFullScreenMode: getIsFullScreenMode(state),
    filter: getFilter(state),
    isReady: !!(isCardReady && risksLength && risk),
  };
};

export default compose(
  connect(mapStateToProps),
  branch(
    prop('risksLength'),
    identity,
    renderComponent(RisksRHS.NotFound),
  ),
  branch(
    prop('doesNotExist'),
    renderComponent(RisksRHS.NotExist),
    identity,
  ),
  shouldUpdate((props, nextProps) => {
    const omitRiskKeys = omitC(['updatedAt']);
    return !!(
      props.isReady !== nextProps.isReady ||
      props.isFullScreenMode !== nextProps.isFullScreenMode ||
      notEquals(omitRiskKeys(props.risk), omitRiskKeys(nextProps.risk))
    );
  }),
)(RisksRHS);
