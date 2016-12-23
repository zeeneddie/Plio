export const DEFAULT_POLLING_INTERVAL_FOR_COUNTER = 5000; // 5 sec
export const ALERT_AUTOHIDE_TIME = 1500;

export const DocumentTitles = {
  STANDARD: 'Standard',
  NC: 'Non-conformity',
  RISK: 'Risk',
};

export const NonConformityFilters = {
  1: 'magnitude',
  2: 'status',
  3: 'department',
  4: 'deleted',
};

export const RiskFilters = {
  1: 'type',
  2: 'status',
  3: 'department',
  4: 'deleted',
};

export const StandardFilters = {
  1: { name: 'section', prepend: 'by' },
  2: { name: 'type', prepend: 'by' },
  3: { name: 'deleted', prepend: '' },
};

export const STANDARD_FILTER_MAP = {
  SECTION: 1,
  TYPE: 2,
  DELETED: 3,
};

export const WorkInboxFilters = {
  1: 'my current',
  2: 'team current',
  3: 'my completed',
  4: 'team completed',
  5: 'my deleted',
  6: 'team deleted',
};

export const UncategorizedTypeSection = {
  _id: 'uncategorized',
  title: 'Uncategorized',
  abbreviation: 'UNC',
};

export const TruncatedStringLengths = {
  c40: 40,
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
  deletedBy: 1,
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
  deletedBy: 1,
  magnitude: 1,
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
  deletedBy: 1,
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
  deletedBy: 1,
<<<<<<< HEAD
  magnitude: 1,
=======
>>>>>>> 4581e9d2500fc21a0e0dfe58dd0eea3eff8899cc
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
  deletedBy: 1,
};

export const StandardsBookSectionsListProjection = {
  organizationId: 1,
  title: 1,
};

export const StandardTypesListProjection = {
  organizationId: 1,
  title: 1,
};

export const DepartmentsListProjection = {
  organizationId: 1,
  name: 1,
};

export const AnalysisTitles = {
  rootCauseAnalysis: 'Root cause analysis',
  riskAnalysis: 'Initial risk analysis',
  updateOfStandards: 'Update of standard(s)',
  updateOfRiskRecord: 'Update of risk record',
};

export const ActionTitles = {
  CA: 'Corrective action',
  PA: 'Preventative action',
  RK: 'Risk control',
};

export const riskScoreTypes = {
  inherent: {
    id: 'inherent',
    label: 'Inherent risk',
    adj: 'Inherent',
  },
  residual: {
    id: 'residual',
    label: 'Residual risk',
    adj: 'Residual',
  },
};

export const StringLimits = {
  abbreviation: {
    min: 1,
    max: 4,
  },
  title: {
    min: 1,
    max: 80,
  },
};

export const PullMap = {
  left: 'pull-xs-left',
  right: 'pull-xs-right',
  center: 'pull-xs-center',
};

export const TextAlignMap = {
  left: 'text-xs-left',
  right: 'text-xs-right',
  center: 'text-xs-center',
};

export const MarginMap = {
  left: 'margin-left',
  'left-2x': 'margin-left-2x',
  right: 'margin-right',
  'right-2x': 'margin-right-2x',
  bottom: 'margin-bottom',
};

export const MOBILE_BREAKPOINT = 768;
