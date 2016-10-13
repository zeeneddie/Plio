import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/share/collections/audit-logs.js';
import { SystemName } from '/imports/share/constants.js';
import { isOrgMember } from '../../checkers.js';
import { getCollectionByDocType } from '/imports/share/helpers.js';
import Counter from '../../counter/server.js';


const checkSubsArgs = (userId, documentId, documentType) => {
  if (!userId) {
    return false;
  }

  const docCollection = getCollectionByDocType(documentType);
  const doc = docCollection && docCollection.findOne({ _id: documentId });
  const { organizationId } = doc || {};

  if (!organizationId || !isOrgMember(userId, organizationId)) {
    return false;
  }

  return true;
};

Meteor.publish('auditLogs', function(documentId, documentType, skip=0, limit=10) {
  if (!checkSubsArgs(this.userId, documentId, documentType)) {
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

Meteor.publish('documentLogsCount', function(counterName, documentId, documentType) {
  if (!checkSubsArgs(this.userId, documentId, documentType)) {
    return this.ready();
  }

  return new Counter(counterName, AuditLogs.find({ documentId }));
});

Meteor.publish('lastUserLog', function(documentId, documentType) {
  if (!checkSubsArgs(this.userId, documentId, documentType)) {
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
