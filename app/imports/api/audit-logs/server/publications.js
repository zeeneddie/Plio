import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/share/collections/audit-logs.js';
import { CollectionNames, SystemName } from '/imports/share/constants.js';
import { isOrgMember, canChangeOrgSettings } from '../../checkers.js';
import { getCollectionByName } from '/imports/share/helpers.js';
import Counter from '../../counter/server.js';


const checkSubsArgs = (userId, documentId, collection) => {
  if (!userId) {
    return false;
  }

  const docCollection = getCollectionByName(collection);
  const doc = docCollection && docCollection.findOne({ _id: documentId });

  let organizationId;
  if (collection === CollectionNames.ORGANIZATIONS) {
    organizationId = documentId;
  } else {
    organizationId = doc && doc.organizationId;
  }

  if (!organizationId || !isOrgMember(userId, organizationId)) {
    return false;
  }

  return true;
};

Meteor.publish('auditLogs', function(documentId, collection, skip=0, limit=10) {
  if (!checkSubsArgs(this.userId, documentId, collection)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId
  }, {
    skip,
    limit,
    sort: { date: -1 }
  });
});

Meteor.publish('auditLogsCount', function(counterName, documentId, collection) {
  if (!checkSubsArgs(this.userId, documentId, collection)) {
    return this.ready();
  }

  return new Counter(counterName, AuditLogs.find({ documentId }));
});

Meteor.publish('lastHumanLog', function(documentId, collection) {
  if (!checkSubsArgs(this.userId, documentId, collection)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId,
    executor: { $ne: SystemName }
  }, {
    limit: 1,
    sort: { date: -1 }
  });
});
