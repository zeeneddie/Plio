import { composeWithTracker } from 'react-komposer';
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
import ReactDOM from 'react-dom';

import { Organizations } from '/imports/share/collections/organizations';
import { Standards } from '/imports/share/collections/standards';
import { Departments } from '/imports/share/collections/departments';
import { Files } from '/imports/share/collections/files';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { Actions } from '/imports/share/collections/actions';
import { WorkItems } from '/imports/share/collections/work-items';
import { LessonsLearned } from '/imports/share/collections/lessons';
import {
  DocumentLayoutSubs,
  DocumentCardSubs,
  BackgroundSubs,
  CountSubs,
} from '/imports/startup/client/subsmanagers';
import StandardsLayout from '../../components/StandardsLayout';
import {
  initSections,
  initTypes,
  setIsCardReady,
  initStandards,
} from '/client/redux/actions/standardsActions';
import {
  setOrg,
  setOrgId,
  setOrgSerialNumber,
} from '/client/redux/actions/organizationsActions';
import {
  setFilter,
  setUserId,
  setUrlItemId,
  setSearchText,
  setDataLoading,
} from '/client/redux/actions/globalActions';
import {
  setDepartments,
  setFiles,
  setNCs,
  setRisks,
  setActions,
  setWorkItems,
  setStandardBookSections,
  setStandardTypes,
  setStandards,
  setLessons,
} from '/client/redux/actions/collectionsActions';
import { setIsDiscussionOpened } from '/client/redux/actions/discussionActions';
import { setShowCard } from '/client/redux/actions/mobileActions';
import { setStandardMessagesNotViewedCountMap } from '/client/redux/actions/countersActions';
import { getState } from '/client/redux/store';
import {
  getId,
  pickDeep,
  shallowCompare,
  testPerformance,
} from '/imports/api/helpers';
import { StandardFilters, MOBILE_BREAKPOINT } from '/imports/api/constants';
import { goToDashboard } from '../../../helpers/routeHelpers';
import _counter_ from '/imports/startup/client/mixins/counter';
import { redirectByFilter, openStandardByFilter, shouldUpdateForProps } from './helpers';
import { findSelectedStandard } from '../../helpers';

const loadInitialData = ({
  dispatch,
  isDiscussionOpened = false,
}, onData) => {
  const userId = Meteor.userId();
  const orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const filter = parseInt(FlowRouter.getQueryParam('filter'), 10) || 1;
  const urlItemId = FlowRouter.getParam('urlItemId');

  const actions = [
    setUserId(userId),
    setOrgSerialNumber(orgSerialNumber),
    setFilter(filter),
    setUrlItemId(urlItemId),
    setIsDiscussionOpened(isDiscussionOpened),
  ];

  dispatch(batchActions(actions));

  onData(null, { orgSerialNumber, filter, dispatch });
};

const loadLayoutData = ({
  dispatch,
  filter,
  orgSerialNumber,
}, onData) => {
  const isDeleted = filter === 3
          ? true
          : { $in: [null, false] };

  const subscription = DocumentLayoutSubs.subscribe('standardsLayout', orgSerialNumber, isDeleted);

  if (subscription.ready()) {
    const organization = Organizations.findOne({ serialNumber: orgSerialNumber });
    const organizationId = getId(organization);
    const actions = [
      setOrg(organization),
      setOrgId(organizationId),
      setDataLoading(false),
    ];

    dispatch(batchActions(actions));

    onData(null, {});
  } else {
    dispatch(setDataLoading(true));

    onData(null, null);
  }

  return () => typeof subscription === 'function' && subscription.stop();
};

const loadMainData = ({
  dispatch,
  organizationId,
}, onData) => {
  const query = { organizationId };
  const options = { sort: { title: 1 } };
  const sections = StandardsBookSections.find(query, options).fetch();
  const types = StandardTypes.find(query, options).fetch();
  const standards = Standards.find(query, options).fetch();
  const actions = [
    setStandardBookSections(sections),
    setStandardTypes(types),
    setStandards(standards),
  ];

  dispatch(batchActions(actions));

  onData(null, {});
};

const loadCountersData = ({
  dispatch,
  standards,
}, onData) => {
  const subscriptions = standards.map(({ _id }) => Meteor.subscribe(
    'messagesNotViewedCount',
    `standard-messages-not-viewed-count-${_id}`,
    _id
  ));

  if (subscriptions.every(subscription => subscription.ready())) {
    const unreadMessagesCountMap = standards.reduce((map, { _id }) => ({
      ...map,
      [_id]: _counter_.get(`standard-messages-not-viewed-count-${_id}`),
    }), {});

    dispatch(setStandardMessagesNotViewedCountMap(unreadMessagesCountMap));
  }

  onData(null, {});

  return () => subscriptions.map(subscription => subscription.stop());
};

const initMainData = ({
  dispatch,
  standards,
  unreadMessagesCountMap = {},
  standardBookSections: sections,
  standardTypes: types,
}, onData) => {
  dispatch(initStandards({ types, sections, standards, unreadMessagesCountMap }));

  const newStandards = getState('standards').standards;

  dispatch(initSections({ sections, types, standards: newStandards }));

  const newSections = getState('standards').sections;

  dispatch(initTypes({ types, sections: newSections }));

  onData(null, {});
};

const loadCardData = ({
  dispatch,
  standard,
  organizationId,
  urlItemId,
}, onData) => {
  let subscription;
  let isCardReady = true;

  if (standard) {
    const subArgs = { organizationId, _id: urlItemId };

    subscription = DocumentCardSubs.subscribe('standardCard', subArgs);

    isCardReady = subscription.ready();
  }

  dispatch(setIsCardReady(isCardReady));

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
};

const loadDeps = ({ dispatch, organizationId }, onData) => {
  const subscription = BackgroundSubs.subscribe('standardsDeps', organizationId);

  if (subscription.ready()) {
    const query = { organizationId };
    const pOptions = { sort: { serialNumber: 1 } };
    const departments = Departments.find(query, { sort: { name: 1 } }).fetch();
    const files = Files.find(query, { sort: { updatedAt: -1 } }).fetch();
    const ncs = NonConformities.find(query, pOptions).fetch();
    const risks = Risks.find(query, pOptions).fetch();
    const actions = Actions.find(query, pOptions).fetch();
    const workItems = WorkItems.find(query, pOptions).fetch();
    const lessons = LessonsLearned.find(query, pOptions).fetch();
    const reduxActions = [
      setDepartments(departments),
      setFiles(files),
      setNCs(ncs),
      setRisks(risks),
      setActions(actions),
      setWorkItems(workItems),
      setLessons(lessons),
    ];

    dispatch(batchActions(reduxActions));
  }

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
};

export default compose(
  connect(),
  defaultProps({ filters: StandardFilters }),
  composeWithTracker(testPerformance(loadInitialData), null, null, {
    shouldResubscribe: (props, nextProps) =>
      props.isDiscussionOpened !== nextProps.isDiscussionOpened,
  }),
  // We need a key here to force component remount on filter change
  composeWithTracker(
    testPerformance(loadLayoutData),
    withProps({ loading: true })(StandardsLayout),
    null,
    {
      shouldResubscribe: (props, nextProps) =>
        props.orgSerialNumber !== nextProps.orgSerialNumber || props.filter !== nextProps.filter,
    }
  ),
  connect(pickDeep(['organizations.organizationId'])),
  composeWithTracker(testPerformance(loadMainData), null, null, {
    shouldResubscribe: shallowCompare,
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
  withProps(props => ({ standard: findSelectedStandard(props.urlItemId)(props) })),
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
    'global.urlItemId',
    'global.filter',
  ])),
  withProps(props => ({ standard: findSelectedStandard(props.urlItemId)(props) })),
  shouldUpdate(shouldUpdateForProps),
  lifecycle({
    componentWillMount() {
      redirectByFilter(this.props);
    },
    componentDidMount() {
      openStandardByFilter(this.props);
    },
    /**
     * Collapse(maybe) and redirect(maybe) when:
     * changes organization
     * changes orgSerialNumber
     * changes filter
     * the current selected standard's section or type id is different than the next.
     * the current standard is deleted or restored
     */
    componentWillReceiveProps(nextProps) {
      redirectByFilter(nextProps);
    },
    componentWillUpdate(nextProps) {
      openStandardByFilter(nextProps);
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
      if (props.width <= MOBILE_BREAKPOINT) {
        if (props.isDiscussionOpened && !props.showCard) {
          return props.dispatch(setShowCard(true));
          // redirect to the standard
        } else if (!props.isDiscussionOpened && props.showCard) {
          return props.dispatch(setShowCard(false));
        }
      }

      // remove when dashboard is written in react
      ReactDOM.unmountComponentAtNode(document.getElementById('app'));

      return goToDashboard();
    },
  }),
)(StandardsLayout);
