import React from 'react';
import { composeWithTracker } from 'react-komposer';
import property from 'lodash.property';
import get from 'lodash.get';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { Organizations } from '/imports/share/collections/organizations';
import { Standards } from '/imports/share/collections/standards';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import {
  DocumentLayoutSubs,
  DocumentCardSubs,
  BackgroundSubs
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
} from '/client/redux/actions/standardsActions';
import {
  setOrg,
  setOrgId,
  setOrgSerialNumber
} from '/client/redux/actions/organizationsActions';
import {
  setFilter
} from '/client/redux/actions/globalActions';
import { getState } from '/client/redux/store';

const onPropsChange = ({ content, dispatch }, onData) => {
  const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const standardId = FlowRouter.getParam('standardId');
  const filter = parseInt(FlowRouter.getQueryParam('filter'), 10);
  const layoutSubscription = DocumentLayoutSubs.subscribe('standardsLayout', serialNumber);

  if (layoutSubscription.ready()) {
    const organization = Organizations.findOne({ serialNumber });
    const organizationId = get(organization, '_id');

    const sections = StandardsBookSections.find({ organizationId }, { sort: { title: 1 } }).fetch();
    const types = StandardTypes.find({ organizationId }, { sort: { title: 1 } }).fetch();
    const standards = Standards.find({ organizationId }, { sort: { title: 1 } }).fetch();
    const standard = Standards.findOne({ _id: standardId });

    const isCardReady = (function() {
      if (standardId) {
        const subArgs = { organizationId, _id: standardId };

        const cardSubscription = DocumentCardSubs.subscribe('standardCard', subArgs, {
          onReady() {
            BackgroundSubs.subscribe('standardsDeps', organizationId)
          }
        });

        return cardSubscription.ready();
      }

      return true;
    })();

    const actions = [
      setOrg(organization),
      setOrgId(organizationId),
      setOrgSerialNumber(serialNumber),
      setTypes(types),
      setStandards(standards),
      setStandard(standard),
      setStandardId(standardId),
      setIsCardReady(isCardReady),
      setFilter(filter),
      initSections(sections),
      initTypes(types),
    ];

    dispatch(batchActions(actions));

    onData(null, {
      content,
      organization,
      orgSerialNumber: serialNumber
    });
  }
};


export default compose(
  connect(),
  composeWithTracker(onPropsChange, PreloaderPage),
  lifecycle({
    componentWillMount() {
      if (FlowRouter.getRouteName() !== 'standard') {
        const { orgSerialNumber } = this.props;

        FlowRouter.go('standard', {
          orgSerialNumber,
          standardId: get(this.props, 'sections[0].standards[0]._id')
        });
      }
    }
  })
)(StandardsPage);
