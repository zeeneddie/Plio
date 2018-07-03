import { compose as kompose } from '@storybook/react-komposer';
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
import { Meteor } from 'meteor/meteor';
import { always, view } from 'ramda';
import { lenses } from 'plio-util';

import StandardsLayout from '../../components/Layout';
import {
  identity,
  invokeStop,
  every,
  not,
} from '../../../../../api/helpers';
import { StandardFilters, STANDARD_FILTER_MAP } from '../../../../../api/constants';
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
import { setInitializing } from '../../../../store/actions/standardsActions';
import { composeWithTracker } from '../../../../util';
import {
  getFilter,
  getUrlItemId,
  getDataLoading,
} from '../../../../store/selectors/global';
import {
  getOrgSerialNumber,
  getOrganizationId,
  getOrganization,
} from '../../../../store/selectors/organizations';
import { getIsInProgress } from '../../../../store/selectors/dataImport';
import {
  getStandardsInitializing,
  getStandardsAreDepsReady,
  getSelectedStandard,
} from '../../../../store/selectors/standards';
import { getIsDiscussionOpened } from '../../../../store/selectors/discussion';
import { getWindowWidth } from '../../../../store/selectors/window';
import { getMobileShowCard } from '../../../../store/selectors/mobile';
import { namedCompose } from '../../../helpers';

const getLayoutData = () => loadLayoutData(({ filter, orgSerialNumber }) => {
  const isDeleted = filter === STANDARD_FILTER_MAP.DELETED;

  return Meteor.subscribe('standardsLayout', orgSerialNumber, isDeleted);
});

export default namedCompose('StandardsDataLoader')(
  connect(),
  defaultProps({ filters: StandardFilters }),
  kompose(loadIsDiscussionOpened),
  composeWithTracker(loadInitialData, {
    propsToWatch: [],
  }),
  connect(state => ({
    filter: getFilter(state),
    orgSerialNumber: getOrgSerialNumber(state),
    isInProgress: getIsInProgress(state),
  })),
  branch(
    view(lenses.isInProgress),
    withProps(always({ loading: true })),
    composeWithTracker(
      getLayoutData(),
      {
        propsToWatch: ['orgSerialNumber', 'filter'],
        shouldSubscribe: (props, nextProps) => (
          props.orgSerialNumber !== nextProps.orgSerialNumber ||
          ((props.filter === 1 || props.filter === 2) && nextProps.filter === 3) ||
          (props.filter === 3 && (nextProps.filter === 1 || nextProps.filter === 2))
        ),
      },
    ),
  ),
  branch(
    view(lenses.loading),
    renderComponent(StandardsLayout),
    identity,
  ),
  composeWithTracker(loadUsersData),
  connect(state => ({
    organizationId: getOrganizationId(state),
  })),
  lifecycle({
    componentWillMount() {
      this.props.dispatch(setInitializing(true));

      loadMainData(this.props, () => null);
    },
  }),
  connect(state => ({
    organizationId: getOrganizationId(state),
    urlItemId: getUrlItemId(state),
  })),
  branch(
    view(lenses.organizationId),
    composeWithTracker(loadCardData, {
      propsToWatch: ['organizationId', 'urlItemId'],
    }),
    identity,
  ),
  connect(state => ({
    organizationId: getOrganizationId(state),
    initializing: getStandardsInitializing(state),
  })),
  branch(
    view(lenses.organizationId),
    composeWithTracker(loadDeps, {
      propsToWatch: ['organizationId', 'initializing'],
    }),
    identity,
  ),
  connect(state => ({
    areDepsReady: getStandardsAreDepsReady(state),
    initializing: getStandardsInitializing(state),
    dataLoading: getDataLoading(state),
  })),
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
        compose(not, view(lenses.dataLoading)),
        view(lenses.areDepsReady),
        view(lenses.initializing),
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
    standard: getSelectedStandard(state),
    organization: getOrganization(state),
    orgSerialNumber: getOrgSerialNumber(state),
    isDiscussionOpened: getIsDiscussionOpened(state),
    urlItemId: getUrlItemId(state),
    filter: getFilter(state),
  })),
  onlyUpdateForKeys([
    'isDiscussionOpened',
    'loading',
    'organization',
    'orgSerialNumber',
    'filter',
  ]),
  connect(state => ({
    width: getWindowWidth(state),
    showCard: getMobileShowCard(state),
  })),
  withHandlers({
    onHandleFilterChange,
    onHandleReturn,
  }),
)(StandardsLayout);
