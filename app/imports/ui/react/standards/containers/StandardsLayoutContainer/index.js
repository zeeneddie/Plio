import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'recompose';
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
import StandardsPage from '../../components/StandardsPage';

const onPropsChange = ({ content }, onData) => {
  const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
  const standardId = FlowRouter.getParam('standardId');
  const layoutSubscription = DocumentLayoutSubs.subscribe('standardsLayout', serialNumber);

  if (layoutSubscription.ready()) {
    const organization = Organizations.findOne({ serialNumber });
    const organizationId = get(organization, '_id');

    const sections = StandardsBookSections.find({ organizationId }).fetch();
    const types = StandardTypes.find({ organizationId }).fetch();
    const standards = Standards.find({ organizationId }).fetch();
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
      sections,
      types,
      standard,
      standards,
      content,
      isCardReady,
      standardId,
      orgSerialNumber: serialNumber
    });
  }
};

export default compose(
  composeWithTracker(onPropsChange, PreloaderPage)
)(StandardsPage);
