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
import { batchActions } from 'redux-batched-actions';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { DocumentLayoutSubs } from '/imports/startup/client/subsmanagers';
import StandardsLayout from '../../components/StandardsLayout';
import {
  setFilter,
  setSearchText,
} from '/client/redux/actions/globalActions';
import { setShowCard } from '/client/redux/actions/mobileActions';
import {
  pickDeep,
  testPerformance,
} from '/imports/api/helpers';
import { StandardFilters, MOBILE_BREAKPOINT } from '/imports/api/constants';
import { goToDashboard, goToStandard } from '../../../helpers/routeHelpers';
import { redirectByFilter, openStandardByFilter, shouldUpdateForProps } from './helpers';
import { withStandard } from '../../helpers';
import loadInitialData from '../../../loaders/loadInitialData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadMainData from '../../loaders/loadMainData';
import loadCountersData from '../../loaders/loadCountersData';
import initMainData from '../../loaders/initMainData';
import loadCardData from '../../loaders/loadCardData';
import loadDeps from '../../loaders/loadDeps';
import { Standards } from '/imports/share/collections/standards';
import {
  addStandard,
  updateStandard,
  removeStandard,
} from '/client/redux/actions/collectionsActions';
import { setInitializing } from '/client/redux/actions/standardsActions';

const getLayoutData = () => loadLayoutData(({ filter, orgSerialNumber }) => {
  const isDeleted = filter === 3
          ? true
          : { $in: [null, false] };

  return DocumentLayoutSubs.subscribe('standardsLayout', orgSerialNumber, isDeleted);
});

export default compose(
  connect(),
  defaultProps({ filters: StandardFilters }),
  kompose(testPerformance(loadIsDiscussionOpened)),
  composeWithTracker(testPerformance(loadInitialData), null, null, {
    shouldResubscribe: false,
  }),
  connect(pickDeep([
    'global.filter',
    'organizations.orgSerialNumber',
  ])),
  composeWithTracker(
    testPerformance(getLayoutData()),
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
  connect(pickDeep(['organizations.organizationId', 'standards.initializing'])),
  composeWithTracker(testPerformance(loadMainData), null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.organizationId !== nextProps.organizationId ||
      props.initializing !== nextProps.initializing,
  }),
  connect(pickDeep(['collections.standards', 'discussion.isDiscussionOpened'])),
  composeWithTracker(testPerformance(loadCountersData), null, null, {
    shouldResubscribe: (props, nextProps) => !!(
      props.isDiscussionOpened && !nextProps.isDiscussionOpened
    ),
  }),
  connect(pickDeep([
    'collections.standardBookSections',
    'collections.standardTypes',
    'collections.standards',
    'counters.standardMessagesNotViewedCountMap',
  ])),
  composeWithTracker(testPerformance(initMainData)),
  connect(pickDeep(['organizations.organizationId', 'global.urlItemId'])),
  withStandard,
  composeWithTracker(testPerformance(loadCardData), null, null, {
    shouldResubscribe: (props, nextProps) => !!(
      props.organizationId !== nextProps.organizationId ||
      props.urlItemId !== nextProps.urlItemId ||
      typeof props.standard !== typeof nextProps.standard
    ),
  }),
  connect(pickDeep(['organizations.organizationId'])),
  composeWithTracker(testPerformance(loadDeps), null, null, {
    shouldResubscribe: (props, nextProps) => props.organizationId !== nextProps.organizationId,
  }),
  connect(pickDeep(['standards.areDepsReady', 'standards.initializing'])),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.initializing && nextProps.areDepsReady) {
        const { dispatch, organizationId } = nextProps;

        Meteor.defer(() => {
          this.handle = Standards.find({ organizationId }).observeChanges({
            added(_id, fields) {
              if (this.handle) {
                console.log('added');
                dispatch(addStandard({ _id, ...fields }));
              }
            },
            changed(_id, fields) {
              console.log('changed');
              dispatch(updateStandard({ _id, ...fields }));
            },
            removed(_id) {
              console.log('removed');
              dispatch(removeStandard(_id));
            },
          });
        });

        dispatch(setInitializing(false));
      }
    },
    componentWillUnmount() {
      return typeof this.handle === 'function' && this.handle.stop();
    },
  }),
  connect(pickDeep([
    'organizations.organization',
    'organizations.orgSerialNumber',
    'standards.standards',
    'standards.sections',
    'standards.types',
    'discussion.isDiscussionOpened',
    'global.urlItemId',
    'global.filter',
  ])),
  shouldUpdate(shouldUpdateForProps),
  lifecycle({
    componentWillMount() {
      Meteor.defer(() => {
        redirectByFilter(this.props);
        openStandardByFilter(this.props);
      });
    },
    /**
     * Collapse(maybe) and redirect(maybe) when:
     * changes organization
     * changes orgSerialNumber
     * changes filter
     * the current selected standard's section or type id is different than the next.
     * the current standard is deleted or restored
     */
    componentWillUpdate(nextProps) {
      Meteor.defer(() => {
        redirectByFilter(nextProps);
        openStandardByFilter(nextProps);
      });
    },
  }),
  connect(pickDeep(['window.width', 'mobile.showCard'])),
  withHandlers({
    onHandleFilterChange: props => index => {
      const filter = parseInt(Object.keys(props.filters)[index], 10);
      const actions = [
        setSearchText(''),
        setFilter(filter),
      ];

      FlowRouter.setQueryParams({ filter });

      props.dispatch(batchActions(actions));
    },
    onHandleReturn: (props) => () => {
      const { orgSerialNumber, urlItemId } = props;

      if (props.width <= MOBILE_BREAKPOINT) {
        props.dispatch(setShowCard(false));

        if (props.isDiscussionOpened) {
          return goToStandard({ orgSerialNumber, urlItemId });
        } else if (!props.isDiscussionOpened && props.showCard) {
          return true;
        }
      }

      return goToDashboard();
    },
  }),
)(StandardsLayout);
