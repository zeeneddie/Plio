import { composeWithTracker, compose as kompose } from 'react-komposer';
import {
  compose,
  lifecycle,
  shouldUpdate,
  defaultProps,
  withHandlers,
  branch,
  renderComponent,
  renameProp,
} from 'recompose';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import property from 'lodash.property';
import React from 'react';
import { Tracker } from 'meteor/tracker';

import StandardsLayout from '../../components/Layout';

import { pickDeep, identity } from '/imports/api/helpers';
import { StandardFilters } from '/imports/api/constants';
import onHandleFilterChange from '../../../handlers/onHandleFilterChange';
import onHandleReturn from '../../../handlers/onHandleReturn';
import loadInitialData from '../../../loaders/loadInitialData';
import loadUsersData from '../../../loaders/loadUsersData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadMainData from '../../loaders/loadMainData';
import loadCardData from '../../loaders/loadCardData';
import loadDeps from '../../loaders/loadDeps';
import { Standards } from '/imports/share/collections/standards';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import '../../observers';
import { setInitializing } from '/imports/client/store/actions/standardsActions';
// const getLayoutData = () => loadLayoutData(({ filter, orgSerialNumber }) => {
//   const isDeleted = filter === 3
//           ? true
//           : { $in: [null, false] };
//
//   return DocumentLayoutSubs.subscribe('standardsLayout', orgSerialNumber, isDeleted);
// });

const getLayoutData = (props) => loadLayoutData(() => {
  const isDeleted = props.filter === 3
          ? true
          : { $in: [null, false] };

  return Meteor.subscribe('standardsLayout', props.orgSerialNumber, isDeleted);
})(props, () => null);

const loadStandardsLayoutData = (Component) => class extends React.Component {
  componentWillMount() {
    this._subscribe(this.props);
  }

  componentWillUnmount() {
    this._unmounted = true;
    this._unsubscribe();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isInProgress && nextProps.isInProgress) {
      this._unsubscribe();
      nextProps.dispatch(setInitializing(true));
    } else this._subscribe(nextProps, this.props);
  }

  shouldComponentUpdate(nextProps) {
    return !!(
      this.props.filter !== nextProps.filter ||
      this.props.orgSerialNumber !== nextProps.orgSerialNumber ||
      this.props.isInProgress !== nextProps.isInProgress
    );
  }

  _subscribe(props) {
    this._unsubscribe();

    Tracker.nonreactive(() =>
      Tracker.autorun(() => {
        if (this._unmounted) return;
        this.subscription = getLayoutData(props);
      }));
  }

  _unsubscribe() {
    if (this.subscription) this.subscription.stop();
  }

  render() {
    return <Component {...this.props} {...this.state} />;
  }
};

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
  loadStandardsLayoutData,
  connect(pickDeep(['global.dataLoading'])),
  renameProp('dataLoading', 'loading'),
  branch(
    property('loading'),
    renderComponent(StandardsLayout),
    identity,
  ),
  composeWithTracker(loadUsersData),
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
  connect(pickDeep(['standards.areDepsReady', 'standards.initializing'])),
  lifecycle({
    componentWillReceiveProps({ areDepsReady, initializing, dispatch, organizationId }) {
      if (areDepsReady && initializing) {
        console.log('os?');
        setTimeout(() => {
          const args = [dispatch, { organizationId }];
          this.observers = [
            Standards.observeStandards(...args),
            StandardsBookSections.observeStandardBookSections(...args),
            StandardTypes.observeStandardTypes(...args),
          ];
        }, 0);

        dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      return this.observers && this.observers.map(os => os.stop());
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
