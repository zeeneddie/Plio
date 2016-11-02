import React from 'react';
import { composeWithTracker } from 'react-komposer';
import property from 'lodash.property';
import get from 'lodash.get';

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
import StandardsPageContainer from '../../containers/StandardsPageContainer';

const onPropsChange = ({ content }, onData) => {
  const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const standardId = FlowRouter.getParam('standardId');
  const filter = FlowRouter.getQueryParam('filter');
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

    onData(null, {
      organization,
      content,
      sections,
      types,
      standards,
      standard,
      standardId,
      isCardReady,
      orgSerialNumber: serialNumber
    });
  }
};


export default composeWithTracker(onPropsChange, PreloaderPage)(StandardsPageContainer);
