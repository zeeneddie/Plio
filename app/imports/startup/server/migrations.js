// import { Migrations } from 'meteor/percolate:migrations';
//
// import { NonConformities } from '/imports/share/collections/non-conformities.js';
// import { Risks } from '/imports/share/collections/risks.js';
// import { WorkItems } from '/imports/share/collections/work-items.js';
// import { Standards } from '/imports/share/collections/standards.js';
// import { Actions } from '/imports/share/collections/actions.js';
//
// const workItems = WorkItems.find({});
// workItems.forEach((workItem) => {
//   const linkedDocInfo = workItem.linkedDoc || {};
//   let linkedDoc;
//   if (linkedDocInfo.type === 'non-conformity') {
//     linkedDoc = NonConformities.findOne({ _id: linkedDocInfo._id });
//   } else if (linkedDocInfo.type === 'risk') {
//     linkedDoc = Risks.findOne({ _id: linkedDocInfo._id });
//   } else if (linkedDocInfo.type === 'standard') {
//     linkedDoc = Standards.findOne({ _id: linkedDocInfo._id });
//   } else if (linkedDocInfo.type === 'action') {
//     linkedDoc = Actions.findOne({ _id: linkedDocInfo._id });
//   }
//
//   if (!linkedDoc) {
//     WorkItems.remove({ _id: workItem._id });
//     console.log(`Work item ${workItem._id} has been removed`);
//   }
// });

import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { Organizations } from '/imports/share/collections/organizations';
import { Discussions } from '/imports/share/collections/discussions.js';
import { Risks } from '/imports/share/collections/risks.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { CollectionNames, SystemName } from '/imports/share/constants';


Migrations.add({
  version: 1,
  name: 'Adds log entry about org creation for orgs with no logs',
  up() {
    Organizations.find({}).forEach((org) => {
      const orgLogsCount = AuditLogs.find({ documentId: org._id }).count();

      if (!orgLogsCount) {
        AuditLogs.insert({
          organizationId: org._id,
          date: new Date(),
          executor: SystemName,
          collection: CollectionNames.ORGANIZATIONS,
          documentId: org._id,
          message: 'Organization created'
        });
      }
    });
  },
  down() { },
});

Migrations.add({
  version: 2,
  name: 'Adds discussions to documents with no discussions',
  up() {
    Risks.find({}).forEach((risk) => {
      
    });
  },
  down() { },
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
});
