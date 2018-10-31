import {
  Notifications,
  AuditLogs,
  Discussions,
  WorkItems,
  Actions,
  Messages,
  NonConformities,
  Standards,
  Organizations,
  Risks,
  Goals,
  Relations,
  Guidances,
} from '../../share/collections';

/*
  All "Single" indexes created in collections Schemas https://github.com/aldeed/meteor-schema-index
  But meteor-schema-index can't create COMPOUND indexes, so we should create them here.
*/

// indexes for Organizations
Organizations._ensureIndex({
  serialNumber: 1,
  'users.userId': 1,
});

// indexes for Standards
Standards._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

Standards._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
  viewedBy: 1,
});

// indexes for NonConformities
NonConformities._ensureIndex({
  sequentialId: 1,
  title: 1,
});

NonConformities._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

// indexes for Risks
Risks._ensureIndex({
  sequentialId: 1,
  title: 1,
});

Risks._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

// Actions indexes
Actions._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

// Work Items indexes
WorkItems._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  assigneeId: 1,
  status: 1,
  targetDate: -1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
});

WorkItems._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
  createdAt: 1,
  isDeleted: 1,
  viewedBy: 1,
});

// Discussions indexes
Discussions._ensureIndex({
  linkedTo: 1,
  documentType: 1,
});

// Messages indexes
Messages._ensureIndex({
  discussionId: 1,
  createdAt: 1,
});

Messages._ensureIndex({
  discussionId: 1,
  createdAt: -1,
});

Messages._ensureIndex({
  organizationId: 1,
  discussionId: 1,
  createdAt: 1,
});

// Audit logs indexes
AuditLogs._ensureIndex({
  documentId: 1,
  executor: 1,
});

AuditLogs._ensureIndex({
  documentId: 1,
  date: -1,
});

// Notifications indexes
Notifications._ensureIndex({
  recepientIds: 1,
  createdAt: 1,
});

// Goals indexes
Goals._ensureIndex({
  organizationId: 1,
  isDeleted: 1,
});

Goals._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
});

Goals._ensureIndex({
  organizationId: 1,
  isCompleted: 1,
  isDeleted: 1,
  priority: 1,
  endDate: 1,
});

// Relations
Relations._ensureIndex({
  'rel1.documentId': 1,
  'rel2.documentType': 1,
});

Relations._ensureIndex({
  'rel1.documentType': 1,
  'rel2.documentId': 1,
});

// Guidances

Guidances._ensureIndex({ documentType: 1 }, { unique: true });
