import { Meteor } from 'meteor/meteor';
import { AuditLogs } from '../audit-logs.js';
import { getCollectionByName } from '../../helpers.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';


const checkSubsArgs = (userId, documentId, collectionName) => {
  if (!userId) {
    return false;
  }

  const docCollection = getCollectionByName(collectionName);
  const doc = docCollection && docCollection.findOne({ _id: documentId });
  const { organizationId } = doc || {};

  if (!organizationId || !isOrgMember(userId, organizationId)) {
    return false;
  }

  return true;
};

Meteor.publish('auditLogs', function(documentId, collectionName, skip=0, limit=10) {
  if (!checkSubsArgs(this.userId, documentId, collectionName)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId,
    collection: collectionName
  }, {
    skip,
    limit,
    sort: { date: -1 }
  });
});

Meteor.publish('documentLogsCount', function(counterName, documentId, collectionName) {
  if (!checkSubsArgs(this.userId, documentId, collectionName)) {
    return this.ready();
  }

  return new Counter(counterName, AuditLogs.find({
    documentId,
    collection: collectionName
  }));
});
