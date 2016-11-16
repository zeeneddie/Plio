import { Meteor } from 'meteor/meteor';

import { AuditLogs } from '/imports/share/collections/audit-logs.js';
import { SystemName } from '/imports/share/constants.js';
import { isOrgMember, canChangeOrgSettings } from '../../checkers.js';
import { getCollectionByDocType } from '/imports/share/helpers.js';
import Counter from '../../counter/server.js';


const checkDocSubsArgs = (userId, documentId, documentType) => {
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

Meteor.publish('docAuditLogs', function(documentId, documentType, skip=0, limit=10) {
  if (!checkDocSubsArgs(this.userId, documentId, documentType)) {
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

Meteor.publish('docLogsCount', function(counterName, documentId, documentType) {
  if (!checkDocSubsArgs(this.userId, documentId, documentType)) {
    return this.ready();
  }

  return new Counter(counterName, AuditLogs.find({ documentId }));
});

Meteor.publish('docLastUserLog', function(documentId, documentType) {
  if (!checkDocSubsArgs(this.userId, documentId, documentType)) {
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

const checkOrgSubsArgs = (userId, organizationId) => {
  if (!userId || !canChangeOrgSettings(userId, organizationId)) {
    return false;
  }

  return true;
};

Meteor.publish('orgAuditLogs', function(organizationId, skip=0, limit=10) {
  if (!checkOrgSubsArgs(this.userId, organizationId)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId: organizationId
  }, {
    skip,
    limit,
    sort: { date: -1 }
  });
});

Meteor.publish('orgLogsCount', function(counterName, organizationId) {
  if (!checkOrgSubsArgs(this.userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, AuditLogs.find({ documentId: organizationId }));
});

Meteor.publish('orgLastUserLog', function(organizationId) {
  if (!checkOrgSubsArgs(this.userId, organizationId)) {
    return this.ready();
  }

  return AuditLogs.find({
    documentId: organizationId,
    executor: { $ne: SystemName }
  }, {
    limit: 1,
    sort: { date: -1 }
  });
});
