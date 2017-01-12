import { composeWithTracker, compose as kompose } from 'react-komposer';
import {
  compose,
  lifecycle,
  shouldUpdate,
  defaultProps,
  withHandlers,
  branch,
  renderComponent,
} from 'recompose';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers';
import StandardsLayout from '../../components/Layout';

import { pickDeep } from '/imports/api/helpers';
import { StandardFilters } from '/imports/api/constants';
import onHandleFilterChange from '../../../handlers/onHandleFilterChange';
import onHandleReturn from '../../../handlers/onHandleReturn';
import loadInitialData from '../../../loaders/loadInitialData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import loadDeps from '../../loaders/loadDeps';
import { setInitializing } from '/imports/client/store/actions/standardsActions';
import {
  observeStandards,
  observeStandardBookSections,
  observeStandardTypes,
} from '../../observers';

const getLayoutData = () => loadLayoutData(({ filter, orgSerialNumber }) => {
  const isDeleted = filter === 3
          ? true
          : { $in: [null, false] };

  return DocumentLayoutSubs.subscribe('standardsLayout', orgSerialNumber, isDeleted);
});

export default compose(
  connect(),
  defaultProps({ filters: StandardFilters }),
  kompose(loadIsDiscussionOpened),
  composeWithTracker(loadInitialData, null, null, {
    shouldResubscribe: false,
  }),
  connect(pickDeep([
    'global.filter',
    'organizations.orgSerialNumber',
  ])),
  composeWithTracker(
    getLayoutData(),
    null,
    null,
    {
      shouldResubscribe: (props, nextProps) =>
        props.orgSerialNumber !== nextProps.orgSerialNumber || props.filter !== nextProps.filter,
    }
  ),
  branch(
    props => props.loading,
    renderComponent(StandardsLayout),
    _.identity
  ),
  connect(pickDeep(['organizations.organizationId'])),
  lifecycle({
    componentWillMount() {
      loadMainData(this.props, () => null);
    },
  }),
  connect(pickDeep(['organizations.organizationId', 'global.urlItemId'])),
  composeWithTracker(loadCardData, null, null, {
    shouldResubscribe: (props, nextProps) => !!(
      props.organizationId !== nextProps.organizationId ||
      props.urlItemId !== nextProps.urlItemId
    ),
  }),
  connect(pickDeep(['organizations.organizationId', 'standards.initializing'])),
  composeWithTracker(loadDeps, null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.organizationId !== nextProps.organizationId ||
      props.initializing !== nextProps.initializing,
  }),
  connect(pickDeep(['global.dataLoading', 'standards.areDepsReady', 'standards.initializing'])),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (!nextProps.dataLoading && nextProps.initializing && nextProps.areDepsReady) {
        const { dispatch, organizationId } = nextProps;

        Meteor.defer(() => {
          const args = [dispatch, { organizationId }];
          this.observers = [
            observeStandards(...args),
            observeStandardBookSections(...args),
            observeStandardTypes(...args),
          ];
        });

        dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      const result = this.observers && this.observers.map(observer => observer && observer.stop());

      this.props.dispatch(setInitializing(true));

      return result;
    },
  }),
  connect(state => ({
    standard: state.collections.standardsByIds[state.global.urlItemId],
    ...pickDeep([
      'organizations.organization',
      'organizations.orgSerialNumber',
      'discussion.isDiscussionOpened',
      'global.urlItemId',
      'global.filter',
    ])(state),
  })),
  shouldUpdate((props, nextProps) => !!(
    props.isDiscussionOpened !== nextProps.isDiscussionOpened ||
    props.loading !== nextProps.loading ||
    typeof props.organization !== typeof nextProps.organization ||
    props.orgSerialNumber !== nextProps.orgSerialNumber ||
    props.filter !== nextProps.filter
  )),
  connect(pickDeep(['window.width', 'mobile.showCard'])),
  withHandlers({
    onHandleFilterChange,
    onHandleReturn,
  }),
)(StandardsLayout);
