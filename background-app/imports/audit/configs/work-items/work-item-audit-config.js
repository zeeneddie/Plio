import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { getLinkedDoc, getLinkedDocAuditConfig } from './helpers.js';

import onCreated from './on-created.js';
import assigneeId from './fields/assigneeId.js';


export default WorkItemAuditConfig = {

  collection: WorkItems,

  collectionName: CollectionNames.WORK_ITEMS,

  onCreated,

  updateHandlers: [
    assigneeId
  ],

  onRemoved: { },

  docId({ _id }) {
    return _id;
  },

  docDescription(doc) {
    const linkedDoc = getLinkedDoc(doc);
    const linkedDocAuditConfig = getLinkedDocAuditConfig(doc);

    return linkedDocAuditConfig.docDescription(linkedDoc);
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId }) || {};
    return Meteor.absoluteUrl(`${serialNumber}/work-inbox?id=${_id}`);
  }
};
