export const AnalysisTitles = {
  rootCauseAnalysis: 'Root cause analysis',
  riskAnalysis: 'Initial risk analysis'
};

export const DEFAULT_POLLING_INTERVAL_FOR_COUNTER = 5000; // 5 sec

export const NonConformityFilters = {
  1: 'magnitude',
  2: 'status',
  3: 'department/sector',
  4: 'deleted'
};

export const RiskFilters = {
  1: 'type',
  2: 'status',
  3: 'department/sector',
  4: 'deleted'
};

export const StandardFilters = {
  1: 'section',
  2: 'type',
  3: 'deleted'
};

export const WorkInboxFilters = {
  1: 'My current work',
  2: 'Team current work',
  3: 'My completed work',
  4: 'Team completed work',
  5: 'My deleted work',
  6: 'Team deleted work'
};

export const UncategorizedTypeSection = {
  _id: 'uncategorized',
  title: 'Uncategorized',
  abbreviation: 'UNC'
};

export const TruncatedStringLengths = {
  c40: 40
};

export const StandardsListProjection = {
  organizationId: 1,
  title: 1,
  typeId: 1,
  sectionId: 1,
  nestingLevel: 1,
  viewedBy: 1,
  createdAt: 1,
  owner: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

export const RisksListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  identifiedAt: 1,
  typeId: 1,
  scores: 1,
  departmentsIds: 1,
  status: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

export const ActionsListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  linkedTo: 1,
  type: 1,
  status: 1,
  ownerId: 1,
  isCompleted: 1,
  completionTargetDate: 1,
  toBeCompletedBy: 1,
  viewedBy: 1,
  createdAt: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

export const NonConformitiesListProjection = {
  organizationId: 1,
  serialNumber: 1,
  sequentialId: 1,
  title: 1,
  cost: 1,
  createdAt: 1,
  identifiedAt: 1,
  magnitude: 1,
  status: 1,
  departmentsIds: 1,
  viewedBy: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};

export const WorkItemsListProjection = {
  organizationId: 1,
  targetDate: 1,
  type: 1,
  status: 1,
  linkedDoc: 1,
  assigneeId: 1,
  viewedBy: 1,
  createdAt: 1,
  isCompleted: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1
};
