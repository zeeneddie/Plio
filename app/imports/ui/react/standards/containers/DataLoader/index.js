import { composeWithTracker, compose as kompose } from 'react-komposer';
import {
  compose,
  lifecycle,
  defaultProps,
  withHandlers,
  branch,
  renderComponent,
  withProps,
  onlyUpdateForKeys,
} from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';
import { Meteor } from 'meteor/meteor';

import StandardsLayout from '../../components/Layout';
import {
  pickDeep,
  identity,
  invokeStop,
  combineObjects,
  pickFrom,
  every,
  not,
  always,
} from '/imports/api/helpers';
import { StandardFilters, STANDARD_FILTER_MAP } from '/imports/api/constants';
import onHandleFilterChange from '../../../handlers/onHandleFilterChange';
import onHandleReturn from '../../../handlers/onHandleReturn';
import loadInitialData from '../../../loaders/loadInitialData';
import loadUsersData from '../../../loaders/loadUsersData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import loadDeps from '../../loaders/loadDeps';
import loadLayoutData from '../../../loaders/loadLayoutData';
import {
  observeStandards,
  observeStandardBookSections,
  observeStandardTypes,
} from '../../observers';
import { setInitializing } from '/imports/client/store/actions/standardsActions';

const getLayoutData = () => loadLayoutData(({ filter, orgSerialNumber }) => {
  const isDeleted = filter === STANDARD_FILTER_MAP.DELETED;

  return Meteor.subscribe('standardsLayout', orgSerialNumber, isDeleted);
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
    'dataImport.isInProgress',
  ])),
  branch(
    property('isInProgress'),
    withProps(always({ loading: true })),
    composeWithTracker(
      getLayoutData(),
      null,
      null,
      {
        shouldResubscribe: (props, nextProps) => (
          props.orgSerialNumber !== nextProps.orgSerialNumber ||
          ((props.filter === 1 || props.filter === 2) && nextProps.filter === 3) ||
          (props.filter === 3 && (nextProps.filter === 1 || nextProps.filter === 2))
        ),
      },
    ),
  ),
  branch(
    property('loading'),
    renderComponent(StandardsLayout),
    identity,
  ),
  composeWithTracker(loadUsersData),
  connect(pickDeep(['organizations.organizationId'])),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(setInitializing(true));

      loadMainData(this.props, () => null);
    },
  }),
  connect(pickDeep(['organizations.organizationId', 'global.urlItemId'])),
  branch(
    property('organizationId'),
    composeWithTracker(loadCardData, null, null, {
      shouldResubscribe: (props, nextProps) => !!(
        props.organizationId !== nextProps.organizationId ||
        props.urlItemId !== nextProps.urlItemId
      ),
    }),
    identity,
  ),
  connect(pickDeep(['organizations.organizationId', 'standards.initializing'])),
  branch(
    property('organizationId'),
    composeWithTracker(loadDeps, null, null, {
      shouldResubscribe: (props, nextProps) =>
        props.organizationId !== nextProps.organizationId ||
        props.initializing !== nextProps.initializing,
    }),
    identity,
  ),
  connect(combineObjects([
    pickFrom('standards', ['areDepsReady', 'initializing']),
    pickDeep(['global.dataLoading']),
  ])),
  lifecycle({
    componentWillMount() {
      this._startObservers(this.props);
    },

    componentWillReceiveProps(nextProps) {
      this._startObservers(nextProps);
    },

    componentWillUnmount() {
      if (this.observers && this.observers.length) {
        this.observers.map(invokeStop);
      }
    },

    _startObservers(props) {
      const pred = every([
        compose(not, property('dataLoading')),
        property('areDepsReady'),
        property('initializing'),
      ]);

      if (pred(props) && (!this.observers || !this.observers.length)) {
        const { dispatch, organizationId } = props;
        const args = [dispatch, { organizationId }];

        Meteor.defer(() => {
          this.observers = [
            observeStandards(...args),
            observeStandardBookSections(...args),
            observeStandardTypes(...args),
          ];
        });

        props.dispatch(setInitializing(false));
      }
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
  onlyUpdateForKeys([
    'isDiscussionOpened',
    'loading',
    'organization',
    'orgSerialNumber',
    'filter',
  ]),
  connect(pickDeep(['window.width', 'mobile.showCard'])),
  withHandlers({
    onHandleFilterChange,
    onHandleReturn,
  }),
)(StandardsLayout);
