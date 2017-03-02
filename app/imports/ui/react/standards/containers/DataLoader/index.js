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

let observers = [];

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
          props.filter !== nextProps.filter
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
  branch(
    every([
      compose(not, property('dataLoading')),
      property('areDepsReady'),
      property('initializing'),
    ]),
    lifecycle({
      componentDidMount() {
        const { dispatch, organizationId } = this.props;
        const args = [dispatch, { organizationId }];

        Meteor.defer(() => {
          observers = [
            observeStandards(...args),
            observeStandardBookSections(...args),
            observeStandardTypes(...args),
          ];
        });

        dispatch(setInitializing(false));
      },
    }),
    lifecycle({
      componentWillUnmount() {
        if (observers.length) observers.map(invokeStop);
      },
    }),
  ),
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
