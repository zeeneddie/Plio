export const DEFAULT_POLLING_INTERVAL_FOR_COUNTER = 5000; // 5 sec

const DocumentTitles = {
  STANDARD: 'Standard',
  NC: 'Non-conformity',
  RISK: 'Risk'
};

export const NonConformityFilters = {
  1: 'magnitude',
  2: 'status',
  3: 'department',
  4: 'deleted'
};

export const RiskFilters = {
  1: 'type',
  2: 'status',
  3: 'department',
  4: 'deleted'
};

export const StandardFilters = {
  1: 'section',
  2: 'type',
  3: 'deleted'
};

export const WorkInboxFilters = {
  1: 'my current',
  2: 'team current',
  3: 'my completed',
  4: 'team completed',
  5: 'my deleted',
  6: 'team deleted'
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
  ref: 1,
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

export const StandardsBookSectionsListProjection = {
  organizationId: 1,
  title: 1
};

export const StandardTypesListProjection = {
  organizationId: 1,
  title: 1
};

export const DepartmentsListProjection = {
  organizationId: 1,
  name: 1
};

export const AnalysisTitles = {
  rootCauseAnalysis: 'Complete root cause analysis',
  riskAnalysis: 'Complete initial risk analysis',
  updateOfStandards: 'Complete update of standard(s)',
  updateOfRiskRecord: 'Complete update of risk record'
};

export const riskScoreTypes = {
  inherent: {
    id: 'inherent',
    label: 'Inherent risk',
    adj: 'Inherent'
  },
  residual: {
    id: 'residual',
    label: 'Residual risk',
    adj: 'Residual'
  }
};

export const StringLimits = {
  abbreviation: {
    min: 1,
    max: 4
  },
  title: {
    min: 1,
    max: 80
  }
};

export const SystemName = 'Plio';

export const RCAMaxCauses = 5;
