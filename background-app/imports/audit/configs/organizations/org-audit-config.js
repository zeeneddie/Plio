import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants.js';
import { Organizations } from '/imports/share/collections/organizations.js';

import name from './fields/name.js';
import currency from './fields/currency.js';
import timezone from './fields/timezone.js';
import rkScoringGuidelines from './fields/rkScoringGuidelines.js';
import workflowDefaults from './fields/workflowDefaults.js';
import reminders from './fields/reminders.js';
import guidelines from './fields/guidelines.js';


export default OrgAuditConfig = {

  collection: Organizations,

  collectionName: CollectionNames.ORGANIZATIONS,

  onCreated: { },

  updateHandlers: [
    name,
    currency,
    timezone,
    rkScoringGuidelines,
    ...workflowDefaults,
    ...reminders,
    ...guidelines
  ],

  onRemoved: { },

  docId({ _id }) {
    return _id;
  },

  docDescription({ name }) {
    return `"${name}" organization`;
  },

  docOrgId({ _id }) {
    return _id;
  },

  docUrl({ serialNumber }) {
    return Meteor.absoluteUrl(`${serialNumber}`, {
      rootUrl: Meteor.settings.mainApp.url
    });
  }

};
