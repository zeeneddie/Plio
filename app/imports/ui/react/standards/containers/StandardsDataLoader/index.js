import { composeWithTracker, compose as kompose } from 'react-komposer';
import {
  compose,
  lifecycle,
  shouldUpdate,
  defaultProps,
  withHandlers,
  withProps,
  mapProps,
} from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

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
  flattenMapStandards,
} from '/imports/api/helpers';
import { StandardFilters, MOBILE_BREAKPOINT } from '/imports/api/constants';
import { goToDashboard, goToStandard } from '../../../helpers/routeHelpers';
import { redirectByFilter, openStandardByFilter, shouldUpdateForProps } from './helpers';
import { findSelectedStandard } from '../../helpers';
import loadInitialData from '../../../loaders/loadInitialData';
import loadIsDiscussionOpened from '../../../loaders/loadIsDiscussionOpened';
import loadLayoutData from '../../../loaders/loadLayoutData';
import loadMainData from '../../loaders/loadMainData';
import loadCountersData from '../../loaders/loadCountersData';
import initMainData from '../../loaders/initMainData';
import loadCardData from '../../loaders/loadCardData';
import loadDeps from '../../loaders/loadDeps';

const withStandard = withProps(props => ({
  standard: findSelectedStandard(props.urlItemId)(props),
}));

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
    withProps({ loading: true })(StandardsLayout),
    null,
    {
      shouldResubscribe: (props, nextProps) =>
        props.orgSerialNumber !== nextProps.orgSerialNumber || props.filter !== nextProps.filter,
    }
  ),
  connect(pickDeep(['organizations.organizationId'])),
  composeWithTracker(testPerformance(loadMainData), null, null, {
    shouldResubscribe: (props, nextProps) => props.organizationId !== nextProps.organizationId,
  }),
  connect(pickDeep(['collections.standards'])),
  mapProps(props => ({ ...props, standards: props.standards.map(({ _id }) => ({ _id })) })),
  composeWithTracker(testPerformance(loadCountersData), null, null, {
    shouldResubscribe: (props, nextProps) => !_.isEqual(props.standards, nextProps.standards),
  }),
  connect(pickDeep([
    'collections.standardBookSections',
    'collections.standardTypes',
    'collections.standards',
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
  shouldUpdate(testPerformance(shouldUpdateForProps)),
  lifecycle({
    componentWillMount() {
      Meteor.defer(() => redirectByFilter(this.props));
    },
    componentDidMount() {
      Meteor.defer(() => openStandardByFilter(this.props));
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
      console.log('update')
      Meteor.defer(() => redirectByFilter(nextProps));
      Meteor.defer(() => openStandardByFilter(nextProps));
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
        if (props.isDiscussionOpened) {
          return goToStandard({ orgSerialNumber, urlItemId });
          // redirect to the standard
        } else if (!props.isDiscussionOpened && props.showCard) {
          return props.dispatch(setShowCard(false));
        }
      }

      return goToDashboard();
    },
  }),
)(StandardsLayout);
