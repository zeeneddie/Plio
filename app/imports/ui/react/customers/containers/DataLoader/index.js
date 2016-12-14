import { composeWithTracker } from 'react-komposer';
import {
  branch,
  compose,
  lifecycle,
  renderComponent,
  withHandlers,
} from 'recompose';
import { connect } from 'react-redux';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

import { MOBILE_BREAKPOINT } from '/imports/api/constants';
import {
  DocumentLayoutSubs,
  DocumentCardSubs,
} from '/imports/startup/client/subsmanagers';
import { pickDeep } from '/imports/api/helpers';
import { setInitializing } from '/client/redux/actions/customersActions';
import { setShowCard } from '/client/redux/actions/mobileActions';
import { goToDashboard } from '../../../helpers/routeHelpers';
import CustomersLayout from '../../components/Layout';
import loadInitialData from '../../../loaders/loadInitialData';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadCardData from '../../../loaders/loadCardData';
import loadMainData from '../../loaders/loadMainData';
import observeOrganizations from '../../observers/observeOrganizations';

const getLayoutData = () => loadLayoutData(() => (
  DocumentLayoutSubs.subscribe('customersLayout')
));

const getCardData = () => loadCardData(({ urlItemId }) => (
  DocumentCardSubs.subscribe('customerCard', urlItemId)
));

export default compose(
  connect(),

  composeWithTracker(loadInitialData, null, null, {
    shouldResubscribe: false,
  }),

  composeWithTracker(getLayoutData(), null, null, {
    shouldResubscribe: false,
  }),

  branch(
    props => props.loading,
    renderComponent(CustomersLayout),
    _.identity
  ),

  lifecycle({
    componentWillMount() {
      loadMainData(this.props, () => null);
    },
  }),

  connect(pickDeep(['global.urlItemId'])),

  composeWithTracker(getCardData(), null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.urlItemId !== nextProps.urlItemId,
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
      return this.observers && this.observers.forEach(observer =>
        typeof observer === 'function' && observer.stop());
    },
  }),

  withHandlers({
    onHandleReturn: (props) => () => {
      if (props.width <= MOBILE_BREAKPOINT && props.showCard) {
        return props.dispatch(setShowCard(false));
      }

      return goToDashboard();
    },
  })
)(CustomersLayout);
