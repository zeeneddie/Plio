import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { CollectionNames, SystemName } from '/imports/share/constants';
import { isOrgMember } from '../../checkers';
import { getCollectionByName } from '/imports/share/helpers';
import Counter from '../../counter/server';


const checkSubsArgs = (userId, documentId, collectionName) => {
  check(userId, String);
  check(documentId, String);
  check(collectionName, String);

  if (!userId) return false;

  const docCollection = getCollectionByName(collectionName);
  const doc = docCollection && docCollection.findOne({ _id: documentId });

  let organizationId;
  if (collectionName === CollectionNames.ORGANIZATIONS) {
    organizationId = documentId;
  } else {
    organizationId = doc && doc.organizationId;
  }

  if (!organizationId || !isOrgMember(userId, organizationId)) {
    return false;
  }

  return true;
};

Meteor.publish('auditLogs', function (documentId, collectionName, skip = 0, limit = 10) {
  console.log(documentId, collectionName, skip, limit);
  if (!checkSubsArgs(this.userId, documentId, collectionName)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId,
  }, {
    skip,
    limit,
    sort: { date: -1 },
  });
});

Meteor.publish('auditLogsCount', function (counterName, documentId, collectionName) {
  if (!checkSubsArgs(this.userId, documentId, collectionName)) {
    return this.ready();
  }

  return new Counter(counterName, AuditLogs.find({ documentId }));
});

Meteor.publish('lastHumanLog', function (documentId, collectionName) {
  if (!checkSubsArgs(this.userId, documentId, collectionName)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId,
    executor: { $ne: SystemName },
  }, {
    limit: 1,
    sort: { date: -1 },
  });
});
