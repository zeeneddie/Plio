import {
  compose,
  mapProps,
  branch,
  renderComponent,
  shouldUpdate,
} from 'recompose';
import { connect } from 'react-redux';

import {
  notEquals,
  pickDeep,
  identity,
  pickC,
} from '/imports/api/helpers';
import CustomersRHS from '../../components/RHS';

export default compose(
  connect(pickDeep(['collections.organizations'])),

  shouldUpdate((props, nextProps) =>
    props.organizations.length !== nextProps.organizations.length,
  ),

  branch(
    props => !!props.organizations.length,
    identity,
    renderComponent(CustomersRHS.NotFound),
  ),

  connect(state => ({
    ...pickC(['isCardReady', 'urlItemId'])(state.global),
    organization: state.collections.organizationsByIds[state.global.urlItemId],
  })),

  mapProps(({
    isCardReady,
    organization,
    organizations,
    ...props
  }) => ({
    ...props,
    organization,
    isReady: !!(isCardReady && organizations.length && organization),
  })),

  shouldUpdate((props, nextProps) => !!(
    props.isReady !== nextProps.isReady ||
    notEquals(props.organization, nextProps.organization)
  )),

  branch(
    props => props.isReady && props.urlItemId && !props.organization,
    renderComponent(CustomersRHS.NotExist),
    identity,
  ),
)(CustomersRHS);
