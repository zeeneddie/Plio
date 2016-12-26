export const ActionPlanOptions = {
  YES: 'Yes',
  NO: 'No',
  NOT_NEEDED: 'Not needed',
};

export const ActionStatuses = {
  1: 'In progress',
  2: 'In progress - due for completion today',
  3: 'In progress - completion overdue',
  4: 'In progress - completed, not yet verified',
  5: 'In progress - completed, verification due today',
  6: 'In progress - completed, verification overdue',
  7: 'Completed - failed verification',
  8: 'Completed - verified as effective',
  9: 'Completed',
  10: 'Deleted',
};

export const ActionTypes = {
  CORRECTIVE_ACTION: 'CA',
  PREVENTATIVE_ACTION: 'PA',
  RISK_CONTROL: 'RC',
};

export const ActionUndoTimeInHours = 1;

export const AnalysisStatuses = {
  0: 'Not completed',
  1: 'Completed',
};

export const AvatarPlaceholders = [
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/1.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/2.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/3.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/4.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/5.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/6.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/7.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/8.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/9.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/10.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/11.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/12.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/13.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/14.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/15.png',
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/16.png',
];

export const PlioS3Logos = {
  square: 'https://s3-eu-west-1.amazonaws.com/plio/images/p-logo-square.png',
}

export const CollectionNames = {
  ACTIONS: 'Actions',
  AUDIT_LOGS: 'AuditLogs',
  CHANGELOG: 'Changelog',
  DEPARTMENTS: 'Departments',
  DISCUSSIONS: 'Discussions',
  FILES: 'Files',
  HELP_DOCS: 'HelpDocs',
  HELP_SECTIONS: 'HelpSections',
  LESSONS: 'LessonsLearned',
  MESSAGES: 'Messages',
  NCS: 'NonConformities',
  NOTIFICATIONS: 'Notifications',
  OCCURRENCES: 'Occurrences',
  ORGANIZATIONS: 'Organizations',
  RISK_TYPES: 'RiskTypes',
  RISKS: 'Risks',
  STANDARD_TYPES: 'StandardTypes',
  STANDARD_BOOK_SECTIONS: 'StandardsBookSections',
  STANDARDS: 'Standards',
  WORK_ITEMS: 'WorkItems',
};

export const DefaultRiskTypes = [
  {
    title: 'Credit risk',
  },
  {
    title: 'Liquidity risk',
  },
  {
    title: 'Market risk',
  },
  {
    title: 'Operational risk',
  },
  {
    title: 'Regulatory risk',
  },
  {
    title: 'Reputational risk',
  },
  {
    title: 'Infosecurity risk',
  },
];

export const DefaultStandardSections = [
  {
    title: 'Introduction',
  },
  {
    title: 'High level standards',
  },
  {
    title: 'Business standards',
  },
];

export const DefaultStandardTypes = [
  {
    title: 'Process',
    abbreviation: 'PRO',
  },
  {
    title: 'Policy',
    abbreviation: 'POL',
  },
  {
    title: 'Checklist',
    abbreviation: 'CHK',
  },
  {
    title: 'Compliance management objective',
    abbreviation: 'CMO',
  },
  {
    title: 'Compliance obligation',
    abbreviation: 'COB',
  },
  {
    title: 'Standard operating procedure',
    abbreviation: 'SOP',
  },
  {
    title: 'Work instruction',
    abbreviation: 'WORK',
  },
  {
    title: 'Product specification',
    abbreviation: 'SPEC',
  },
  {
    title: 'Risk control',
    abbreviation: 'RSC',
  },
  {
    title: 'Section header',
  },
];

export const DocChangesKinds = {
  DOC_CREATED: 1,
  DOC_UPDATED: 2,
  DOC_REMOVED: 3,
};

export const DefaultHelpSections = [
  {
    index: 1,
    title: 'How to get help',
  },
  {
    index: 2,
    title: 'Getting started',
  },
  {
    index: 3,
    title: 'Creating your Standards manual',
  },
  {
    index: 4,
    title: 'Managing risks',
  },
  {
    index: 5,
    title: 'Managing non-conformities',
  },
  {
    index: 6,
    title: 'Managing workflows',
  },
  {
    index: 7,
    title: 'User management',
  },
  {
    index: 8,
    title: 'FAQs',
  },
];

export const InvitationStatuses = {
  failed: 0,
  invited: 1,
  added: 2,
};

export const PhoneTypes = {
  WORK: 'Work',
  HOME: 'Home',
  MOBILE: 'Mobile',
};

export const ProblemMagnitudes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical',
};

export const ProblemsStatuses = {
  1: 'Open - just reported',
  2: 'Open - just reported, awaiting analysis',
  3: 'Open - just reported, action(s) to be added',
  4: 'Open - analysis due today',
  5: 'Open - analysis overdue',
  6: 'Open - analysis completed, action(s) need to be added',
  7: 'Open - analysis completed, action(s) in place',
  8: 'Open - action(s) due today',
  9: 'Open - action(s) overdue',
  10: 'Open - action(s) completed',
  11: 'Open - action(s) completed, awaiting verification',
  12: 'Open - verification due today',
  13: 'Open - verification past due',
  14: 'Open - action(s) verified as effective, awaiting update of standard(s)',
  15: 'Open - action(s) verified as effective, update of standard(s) due today',
  16: 'Open - action(s) verified as effective, update of standard(s) past due',
  17: 'Open - action(s) failed verification',
  18: 'Closed - action(s) completed',
  19: 'Closed - action(s) verified, standard(s) reviewed',
  20: 'Deleted',
};

export const ProblemTypes = {
  NON_CONFORMITY: 'non-conformity',
  RISK: 'risk',
};

export const DocumentTypes = {
  STANDARD: 'standard',
  ...ProblemTypes,
  ...ActionTypes,
};

export const ReviewStatuses = {
  0: 'Overdue',
  1: 'Awaiting review',
  2: 'Up-to-date',
};

export const RCAMaxCauses = 5;

export const RiskEvaluationDecisions = {
  'tolerate': 'Tolerate',
  'treat': 'Treat',
  'transfer': 'Transfer',
  'terminate': 'Terminate',
};

export const RiskEvaluationPriorities = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High'
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

export const SourceTypes = {
  ATTACHMENT: 'attachment',
  URL: 'url',
  VIDEO: 'video',
};

export const StandardStatuses = {
  'issued': 'Issued',
  'draft': 'Draft'
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

export const TimeUnits = {
  DAYS: 'days',
  WEEKS: 'weeks'
};

export const UserMembership = {
  ORG_OWNER: 'owner',
  ORG_MEMBER: 'member',
};

export const UserRoles = {
  CREATE_UPDATE_DELETE_STANDARDS: 'create-update-delete-standards',
  VIEW_TEAM_ACTIONS: 'view-team-actions',
  INVITE_USERS: 'invite-users',
  DELETE_USERS: 'delete-users',
  EDIT_USER_ROLES: 'edit-user-roles',
  CHANGE_ORG_SETTINGS: 'change-org-settings',
};

export const UserRolesNames = {
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: 'Create & edit standards documents',
  [UserRoles.VIEW_TEAM_ACTIONS]: 'View all Team actions',
  [UserRoles.INVITE_USERS]: 'Invite users',
  [UserRoles.DELETE_USERS]: 'Delete users',
  [UserRoles.EDIT_USER_ROLES]: 'Edit user superpowers',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Change organization settings',
};

export const WorkItemsStore = {
  TYPES: {
    COMPLETE_ACTION: 'complete action',
    VERIFY_ACTION: 'verify action',
    COMPLETE_ANALYSIS: 'complete analysis',
    COMPLETE_UPDATE_OF_DOCUMENTS: 'complete update of documents'
  },
  LINKED_TYPES: {
    ...ActionTypes,
    ...ProblemTypes
  },
  STATUSES: {
    0: 'in progress',
    1: 'due today',
    2: 'overdue',
    3: 'completed'
  }
};

export const WorkflowTypes = {
  THREE_STEP: '3-step',
  SIX_STEP: '6-step'
};

export const OrgOwnerRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
  UserRoles.INVITE_USERS,
  UserRoles.DELETE_USERS,
  UserRoles.EDIT_USER_ROLES,
  UserRoles.CHANGE_ORG_SETTINGS
];

export const OrgMemberRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS
];

export const OrgCurrencies = {
  EUR: 'EUR',
  GBP: 'GBP',
  USD: 'USD'
};

const getDefaultGuideline = (type, problemType) => (
  `Please go to Organization Settings to define what a ${type} ${problemType} means in your organization.`);

const defaultRiskScoringGuideline = 'Please go to Organization settings and provide a brief summary of how Risks should be scored in your organization.';

export const OrganizationDefaults = {
  workflowDefaults: {
    minorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      }
    },
    majorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    },
    criticalProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS
      }
    }
  },
  reminders: {
    minorNc: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      interval : {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    },
    majorNc: {
      start: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 4,
        timeUnit: TimeUnits.DAYS
      }
    },
    criticalNc: {
      start: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 3,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 6,
        timeUnit: TimeUnits.DAYS
      }
    },
    improvementPlan: {
      start: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      until: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    }
  },
  ncGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.NON_CONFORMITY),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.NON_CONFORMITY),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.NON_CONFORMITY)
  },
  rkGuidelines: {
    minor: getDefaultGuideline(ProblemMagnitudes.MINOR, ProblemTypes.RISK),
    major: getDefaultGuideline(ProblemMagnitudes.MAJOR, ProblemTypes.RISK),
    critical: getDefaultGuideline(ProblemMagnitudes.CRITICAL, ProblemTypes.RISK)
  },
  rkScoringGuidelines: defaultRiskScoringGuideline
};

export const StandardTitles = [
  'Standards',
  'Compliance standards',
  'Compliance manual',
  'Quality standards',
  'Quality manual',
];

export const RiskTitles = [
  'Risk register',
  'Risk records',
  'Risks',
];

export const NonConformitiesTitles = [
  'Non-conformities',
  'Exceptions',
];

export const WorkInboxTitles = [
  'Work inbox',
  'Work items',
  'Work',
];

export const EmailsForPlioReporting = [
  'james.ives@pliohub.com',
  'steve.ives@pliohub.com',
];

export const FILE_STATUS_MAP = {
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  TERMINATED: 'terminated',
  FAILED: 'failed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const CustomerTypes = {
  PAYING_SUBSCRIBER: 1,
  FREE_TRIAL: 2,
  TEST_ACCOUNT: 3,
};

export const CustomerTypesNames = {
  [CustomerTypes.PAYING_SUBSCRIBER]: 'Paying subscriber',
  [CustomerTypes.FREE_TRIAL]: 'Free trial',
  [CustomerTypes.TEST_ACCOUNT]: 'Test account',
};
