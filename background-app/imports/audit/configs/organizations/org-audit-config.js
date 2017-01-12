import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants';
import { Organizations } from '/imports/share/collections/organizations';

import name from './fields/name';
import currency from './fields/currency';
import timezone from './fields/timezone';
import rkScoringGuidelines from './fields/rkScoringGuidelines';
import workflowDefaults from './fields/workflowDefaults';
import reminders from './fields/reminders';
import guidelines from './fields/guidelines';


export default OrgAuditConfig = {

  collection: Organizations,

  collectionName: CollectionNames.ORGANIZATIONS,

  onCreated: {
    logs: [
      {
        message: 'Organization created',
      },
    ],
  },

  updateHandlers: [
    name,
    currency,
    timezone,
    rkScoringGuidelines,
    ...workflowDefaults,
    ...reminders,
    ...guidelines,
  ],

  onRemoved: { },

  docId({ _id }) {
    return _id;
  },

  docDescription() {
    return 'organization';
  },

  docName({ name }) {
    return `"${name}"`;
  },

  docOrgId({ _id }) {
    return _id;
  },

  docUrl({ serialNumber }) {
    return Meteor.absoluteUrl(`${serialNumber}`, {
      rootUrl: Meteor.settings.mainApp.url,
    });
  },

};
