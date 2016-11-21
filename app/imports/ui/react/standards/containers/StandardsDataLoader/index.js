import { composeWithTracker } from 'react-komposer';
import get from 'lodash.get';
import {
  compose,
  lifecycle,
  shouldUpdate,
  shallowEqual,
  defaultProps,
  withHandlers,
  withProps,
} from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

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
} from '/imports/startup/client/subsmanagers';
import StandardsLayout from '../../components/StandardsLayout';
import {
  initSections,
  initTypes,
  setStandard,
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
  addCollapsed,
  setUserId,
  chainActions,
  setUrlItemId,
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
  setLessons,
} from '/client/redux/actions/collectionsActions';
import { setIsDiscussionOpened } from '/client/redux/actions/discussionActions';
import { setShowCard } from '/client/redux/actions/mobileActions';
import { setStandardMessagesNotViewedCount } from '/client/redux/actions/countersActions';
import { getState } from '/client/redux/store';
import {
  createSectionItem,
  createTypeItem,
  getSelectedAndDefaultStandardByFilter,
} from '../../helpers';
import {
  getId,
  pickC,
  getC,
  hasC,
  omitC,
  propEqId,
  pickDeep,
  shallowCompare,
  flattenObjects,
} from '/imports/api/helpers';
import { StandardFilters, MOBILE_BREAKPOINT } from '/imports/api/constants';
import { goToDashboard } from '../../../helpers/routeHelpers';
import _counter_ from '/imports/startup/client/mixins/counter';

const onPropsChange = ({
  dispatch,
  isDiscussionOpened = false,
}, onData) => {
  let subscriptions = [];
  const userId = Meteor.userId();
  const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const filter = parseInt(FlowRouter.getQueryParam('filter'), 10) || 1;
  const urlItemId = FlowRouter.getParam('urlItemId');
  const isDeleted = filter === 3
          ? true
          : { $in: [null, false] };

  const layoutSub = DocumentLayoutSubs.subscribe('standardsLayout', serialNumber, isDeleted);

  subscriptions = subscriptions.concat(layoutSub);

  if (layoutSub.ready()) {
    const organization = Organizations.findOne({ serialNumber });
    const organizationId = get(organization, '_id');

    const query = { organizationId };
    const options = { sort: { title: 1 } };

    const sections = StandardsBookSections.find(query, options).fetch();
    const types = StandardTypes.find(query, options).fetch();
    const standards = Standards.find(query, options).fetch();
    const standard = Standards.findOne({ _id: urlItemId });

    const isCardReady = ((() => {
      if (standard) {
        const subArgs = { organizationId, _id: urlItemId };

        const cardSub = DocumentCardSubs.subscribe('standardCard', subArgs);

        subscriptions = subscriptions.concat(cardSub);

        return cardSub.ready();
      }

      return true;
    })());

    if (isCardReady) {
      const backgroundSub = BackgroundSubs.subscribe('standardsDeps', organizationId);

      subscriptions = subscriptions.concat(backgroundSub);

      if (backgroundSub.ready()) {
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
    }

    let reduxActions = [];
    const unreadMessagesCountSubs = standards.map(({ _id }) => Meteor.subscribe(
      'messagesNotViewedCount',
      `standard-messages-not-viewed-count-${_id}`,
      _id
    ));

    if (unreadMessagesCountSubs.every(sub => sub.ready())) {
      const unreadMessagesCountMap = standards.reduce((map, { _id }) => ({
        ...map,
        [_id]: _counter_.get(`standard-messages-not-viewed-count-${_id}`),
      }), {});

      reduxActions = reduxActions.concat(setStandardMessagesNotViewedCount(unreadMessagesCountMap));
    }

    reduxActions = [
      setUserId(userId),
      setOrg(organization),
      setOrgId(organizationId),
      setOrgSerialNumber(serialNumber),
      setIsDiscussionOpened(isDiscussionOpened),
      setStandardBookSections(sections),
      setStandardTypes(types),
      setStandard(standard),
      setUrlItemId(urlItemId),
      setIsCardReady(isCardReady),
      setFilter(filter),
      initSections({ sections, types, standards }),
      initStandards({ types, sections, standards }),
    ];

    dispatch(batchActions(reduxActions));

    dispatch(initTypes({ types, sections: getState('standards').sections }));

    onData(null, {
      organization,
      standard,
      loading: false,
      orgSerialNumber: serialNumber,
      ..._.pick(getState('standards'), 'sections', 'types', 'standards'),
      ..._.pick(getState('global'), 'filter', 'urlItemId'),
    });
  }

  return () => subscriptions.every(sub => typeof sub === 'function' && sub.stop());
};

const redirectByFilter = (props) => {
  const { filter, orgSerialNumber } = props;
  const {
    selected: selectedStandard,
    default: defaultStandard,
  } = getSelectedAndDefaultStandardByFilter(props);
  const shouldRedirect = FlowRouter.getRouteName() === 'standards' || !selectedStandard;

  if (shouldRedirect) {
    const queryParams = { filter };
    if (defaultStandard) {
      const params = {
        orgSerialNumber,
        urlItemId: get(defaultStandard, '_id'),
      };
      FlowRouter.go('standard', params, queryParams);
    } else {
      FlowRouter.go('standards', { orgSerialNumber }, queryParams);
    }
  }
};

const openStandardByFilter = (props) => {
  const { filter } = props;
  const {
    containedIn,
    defaultContainedIn,
    selected: selectedStandard,
  } = getSelectedAndDefaultStandardByFilter(props);
  const parentItem = selectedStandard ? containedIn : defaultContainedIn;
  const topLevelKey = getId(parentItem);

  switch (filter) {
    case 1:
    default: {
      const sectionItem = createSectionItem(topLevelKey);
      props.dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
      break;
    }
    case 2: {
      const secondLevelKey = getId(get(parentItem, 'children[0]'));
      const typeItem = createTypeItem(topLevelKey);
      const sectionItem = createSectionItem(secondLevelKey);
      const typeItemWithClose = { ...typeItem, close: { type: typeItem.type } };
      const sectionItemWithClose = { ...sectionItem, close: { type: sectionItem.type } };
      // Uncategorized type do not have a second level key
      if (secondLevelKey) {
        props.dispatch(chainActions([typeItemWithClose, sectionItemWithClose].map(addCollapsed)));
      } else {
        props.dispatch(addCollapsed(typeItemWithClose));
      }
      break;
    }
    case 3:
      return;
  }
};

const isSameStandard = (props, nextProps) => propEqId(props.standard, nextProps.standard);

const shouldUpdateForStandard = (props, nextProps) => {
  const pickKeys = pickC(['sectionId', 'typeId']);
  const hasIsDeleted = hasC('isDeleted');
  const getIsDeleted = getC('isDeleted');

  return (
    isSameStandard(props, nextProps) &&
    !shallowEqual(pickKeys(props.standard), pickKeys(nextProps.standard)) ||
    ((hasIsDeleted(props.standard) && hasIsDeleted(nextProps.standard)) &&
      getIsDeleted(props.standard) !== getIsDeleted(nextProps.standard))
  );
};

const shouldUpdateForProps = (props, nextProps) => !!(
  typeof props.organization !== typeof nextProps.organization ||
  props.orgSerialNumber !== nextProps.orgSerialNumber ||
  props.filter !== nextProps.filter ||
  typeof props.standard !== typeof nextProps.standard ||
  shouldUpdateForStandard(props, nextProps)
);

const withoutProps = omitC(['width', 'showCard']);
const shouldResubscribe = (props, nextProps) =>
  shallowCompare(withoutProps(props), withoutProps(nextProps));

export default compose(
  connect(pickDeep(['window.width', 'mobile.showCard'])),
  // initial props
  defaultProps({ loading: true, filters: StandardFilters }),
  withProps(() => ({
    filter: parseInt(FlowRouter.getQueryParam('filter'), 10) || 1,
  })),
  withHandlers({
    onHandleFilterChange: props => index => {
      const filter = parseInt(Object.keys(props.filters)[index], 10);
      props.dispatch(setFilter(filter));
    },
    onHandleReturn: (props) => () => {
      if (props.width <= MOBILE_BREAKPOINT) {
        if (props.isDiscussionOpened && !props.showCard) {
          return props.dispatch(setShowCard(true));
          // redirect to standard
        } else if (!props.isDiscussionOpened && props.showCard) {
          return props.dispatch(setShowCard(false));
        }
      }

      return goToDashboard();
    },
  }),
  composeWithTracker(onPropsChange, StandardsLayout, null, { shouldResubscribe }),
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
)(StandardsLayout);
