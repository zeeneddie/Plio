import {
  branch,
  compose,
  lifecycle,
  renderComponent,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import {
  DocumentLayoutSubs,
  DocumentCardSubs,
} from '/imports/startup/client/subsmanagers';
import { pickDeep, identity } from '/imports/api/helpers';
import { setInitializing } from '/imports/client/store/actions/customersActions';
import { setShowCard } from '/imports/client/store/actions/mobileActions';
import { goTo } from '../../../../utils/router/actions';
import CustomersLayout from '../../components/Layout';
import loadInitialData from '../../../loaders/loadInitialData';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadCardData from '../../../loaders/loadCardData';
import loadMainData from '../../loaders/loadMainData';
import loadUsersData from '../../../loaders/loadUsersData';
import observeOrganizations from '../../observers/observeOrganizations';
import { composeWithTracker } from '../../../../../client/util';

const getLayoutData = () => loadLayoutData(() => (
  DocumentLayoutSubs.subscribe('customersLayout')
));

const getCardData = () => loadCardData(({ urlItemId }) => (
  DocumentCardSubs.subscribe('customerCard', urlItemId)
));

export default compose(
  connect(),

  composeWithTracker(loadInitialData, {
    propsToWatch: [],
  }),

  composeWithTracker(getLayoutData(), {
    propsToWatch: [],
  }),

  branch(
    property('loading'),
    renderComponent(CustomersLayout),
    identity,
  ),

  composeWithTracker(loadUsersData, {
    propsToWatch: [],
  }),

  lifecycle({
    componentWillMount() {
      loadMainData(this.props, () => null);
    },
  }),

  connect(pickDeep(['global.urlItemId'])),

  composeWithTracker(getCardData(), {
    propsToWatch: ['urlItemId'],
  }),

  connect(pickDeep(['customers.initializing'])),

  lifecycle({
    componentWillMount() {
      const { initializing, dispatch } = this.props;

      if (initializing) {
        Meteor.defer(() => {
          this.observers = [
            observeOrganizations(dispatch),
          ];
        });

        dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      const result = this.observers && this.observers.map(observer =>
        observer && observer.stop());

      this.props.dispatch(setInitializing(true));

      return result;
    },
  }),

  withHandlers({
    onHandleReturn: props => () => {
      if (props.width <= MOBILE_BREAKPOINT && props.showCard) {
        return props.dispatch(setShowCard(false));
      }

      return goTo('dashboardPage')();
    },
  }),
)(CustomersLayout);
