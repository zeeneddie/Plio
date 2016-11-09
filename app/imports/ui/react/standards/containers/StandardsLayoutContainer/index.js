import { composeWithTracker } from 'react-komposer';
import get from 'lodash.get';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

import { Organizations } from '/imports/share/collections/organizations';
import { Standards } from '/imports/share/collections/standards';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import {
  DocumentLayoutSubs,
  DocumentCardSubs,
  BackgroundSubs,
} from '/imports/startup/client/subsmanagers';
import PreloaderPage from '../../../components/PreloaderPage';
import StandardsPage from '../../components/StandardsPage';
import {
  initSections,
  initTypes,
  setStandards,
  setTypes,
  setStandard,
  setStandardId,
  setIsCardReady,
  initStandards,
  setAllSections,
  setAllTypes,
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
} from '/client/redux/actions/globalActions';
import { getState } from '/client/redux/store';
import {
  createSectionItem,
  createTypeItem,
  findSelectedStandard,
  findSelectedSection,
  getSelectedAndDefaultStandardByFilter,
} from '../../helpers';
import { find, getId } from '/imports/api/helpers';

const onPropsChange = ({ content, dispatch }, onData) => {
  const userId = Meteor.userId();
  const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const filter = parseInt(FlowRouter.getQueryParam('filter'), 10) || 1;
  const standardId = FlowRouter.getParam('standardId');
  const isDeleted = filter === 3
          ? true
          : { $in: [null, false] };
  const layoutSub = DocumentLayoutSubs.subscribe('standardsLayout', serialNumber, isDeleted);

  if (layoutSub.ready()) {
    const organization = Organizations.findOne({ serialNumber });
    const organizationId = get(organization, '_id');

    const query = { organizationId };
    const options = { sort: { title: 1 } };

    const sections = StandardsBookSections.find(query, options).fetch();
    const types = StandardTypes.find(query, options).fetch();
    const standards = Standards.find(query, options).fetch();
    const standard = Standards.findOne({ _id: standardId });

    const isCardReady = ((() => {
      if (standardId) {
        const subArgs = { organizationId, _id: standardId };

        const cardSubscription = DocumentCardSubs.subscribe('standardCard', subArgs, {
          onReady() {
            BackgroundSubs.subscribe('standardsDeps', organizationId);
          },
        });

        return cardSubscription.ready();
      }

      return true;
    })());

    const actions = [
      setUserId(userId),
      setOrg(organization),
      setOrgId(organizationId),
      setOrgSerialNumber(serialNumber),
      setAllSections(sections),
      setAllTypes(types),
      setStandards(standards),
      setStandard(standard),
      setStandardId(standardId),
      setIsCardReady(isCardReady),
      setFilter(filter),
      initSections(sections),
      initTypes(types),
      initStandards(standards),
    ];

    dispatch(batchActions(actions));

    onData(null, {
      content,
      organization,
      orgSerialNumber: serialNumber,
      ..._.pick(getState('standards'), 'sections', 'types', 'standards', 'standardId'),
      ..._.pick(getState('global'), 'filter'),
    });
  }
};


export default compose(
  connect(),
  composeWithTracker(onPropsChange, PreloaderPage),
  lifecycle({
    componentWillMount() {
      const { sections, types, standards, filter, standardId, orgSerialNumber } = this.props;
      const {
        selected: selectedStandard,
        default: defaultStandard,
      } = getSelectedAndDefaultStandardByFilter({
        sections, types, standards, filter, standardId,
      });
      const shouldRedirect = FlowRouter.getRouteName() !== 'standard' || !selectedStandard;

      if (shouldRedirect && defaultStandard) {
        const params = {
          orgSerialNumber,
          standardId: get(defaultStandard, '_id'),
        };
        const queryParams = { filter };

        FlowRouter.go('standard', params, queryParams);
      }
    },
    componentDidMount() {
      const { filter } = this.props;
      const {
        containedIn,
        defaultContainedIn,
        selected: selectedStandard,
      } = getSelectedAndDefaultStandardByFilter(this.props);
      const parentItem = selectedStandard ? containedIn : defaultContainedIn;
      const topLevelKey = getId(parentItem);

      switch (filter) {
        case 1:
        default: {
          const sectionItem = createSectionItem(topLevelKey);
          this.props.dispatch(addCollapsed(sectionItem));
          break;
        }
        case 2: {
          const secondLevelKey = getId(get(parentItem, 'children[0]'));
          const typeItem = createTypeItem(topLevelKey);
          const sectionItem = createSectionItem(secondLevelKey);
          this.props.dispatch(chainActions([typeItem, sectionItem].map(addCollapsed)));
          break;
        }
        case 3:
          return;
      }
    },
  })
)(StandardsPage);
