import { _ } from 'meteor/underscore';
import {
  compose,
  mapProps,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';

import {
  some,
  getC,
  lengthRisks,
  lengthActions,
  notEquals,
  omitC,
  pickDeep,
  identity,
  pickC,
} from '/imports/api/helpers';
import RisksRHS from '../../components/RHS';
import { getRisksByFilter } from '../../helpers';

const mapStateToProps = state => ({
  ...pickC(['isFullScreenMode', 'isCardReady', 'urlItemId'])(state.global),
  risk: state.collections.risksByIds[state.global.urlItemId],
  actions: state.collections.actions.filter(action => (
    _.find(action.linkedTo, ({ documentId }) => (
      documentId === state.global.urlItemId
    ))
  )),
});

export default compose(
  connect(pickDeep(['global.filter', 'collections.risks'])),
  shouldUpdate((props, nextProps) => Boolean(
    lengthRisks(props) !== lengthRisks(nextProps) ||
    lengthActions(props) !== lengthActions(nextProps) ||
    props.filter !== nextProps.filter
  )),
  mapProps(props => ({ risks: getRisksByFilter(props) })),
  branch(
    lengthRisks,
    identity,
    renderComponent(RisksRHS.NotFound),
  ),
  connect(mapStateToProps),
  mapProps(({
    isCardReady,
    risk,
    risks,
    ...props,
  }) => ({
    ...props,
    risk,
    isCardReady,
    isReady: Boolean(isCardReady && risks.length && risk),
  })),
  branch(
    props => props.isCardReady && props.urlItemId && !props.risk,
    renderComponent(RisksRHS.NotExist),
    identity,
  ),
  shouldUpdate((props, nextProps) => {
    const omitRiskKeys = omitC(['updatedAt']);
    return Boolean(
      props.isReady !== nextProps.isReady ||
      props.isFullScreenMode !== nextProps.isFullScreenMode ||
      notEquals(omitRiskKeys(props.risk), omitRiskKeys(nextProps.risk))
    );
  }),
  mapProps((props) => {
    const hasDocxAttachment = some([
      getC('source1.htmlUrl'),
      getC('source2.htmlUrl'),
    ], props.risk);

    return {
      ...props,
      hasDocxAttachment,
    };
  }),
)(RisksRHS);
