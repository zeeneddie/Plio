import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import ProblemAuditConfig from '../problems/problem-audit-config.js';
import NCWorkflow from '/imports/workflow/NCWorkflow.js';

import cost from './fields/cost.js';
import ref from './fields/ref.js';
import refText from './fields/ref.text.js';
import refUrl from './fields/ref.url.js';


export default NCAuditConfig = _.extend({}, ProblemAuditConfig, {

  collection: NonConformities,

  collectionName: CollectionNames.NCS,

  workflowConstructor: NCWorkflow,

  updateHandlers: [
    ...ProblemAuditConfig.updateHandlers,
    cost,
    ref,
    refText,
    refUrl
  ],

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });
    return Meteor.absoluteUrl(`${serialNumber}/non-conformities/${_id}`, {
      rootUrl: Meteor.settings.mainApp.url
    });
  }

});
