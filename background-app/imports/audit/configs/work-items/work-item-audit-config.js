import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants';
import { Organizations } from '/imports/share/collections/organizations';
import { WorkItems } from '/imports/share/collections/work-items';
import { getLinkedDoc, getLinkedDocAuditConfig } from './helpers';

import onCreated from './on-created';
import assigneeId from './fields/assigneeId';
import isCompleted from './fields/isCompleted';
import targetDate from './fields/targetDate';


export default WorkItemAuditConfig = {

  collection: WorkItems,

  collectionName: CollectionNames.WORK_ITEMS,

  onCreated,

  updateHandlers: [
    assigneeId,
    isCompleted,
    targetDate,
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

  docName(doc) {
    const linkedDoc = getLinkedDoc(doc);
    const linkedDocAuditConfig = getLinkedDocAuditConfig(doc);

    return linkedDocAuditConfig.docName(linkedDoc);
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId }) || {};
    return Meteor.absoluteUrl(`${serialNumber}/work-inbox?id=${_id}`, {
      rootUrl: Meteor.settings.mainApp.url,
    });
  },
};
