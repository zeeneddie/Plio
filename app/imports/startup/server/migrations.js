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
