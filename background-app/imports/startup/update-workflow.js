import { Meteor } from 'meteor/meteor';

import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import NCWorkflow from '/imports/workflow/NCWorkflow.js';
import RiskWorkflow from '/imports/workflow/RiskWorkflow.js';

Meteor.startup(() => {
  NonConformities.find({}, {
    fields: { _id: 1 },
  }).forEach(doc => new NCWorkflow(doc._id).refreshStatus());

  Risks.find({}, {
    fields: { _id: 1 },
  }).forEach(doc => new RiskWorkflow(doc._id).refreshStatus());
});
