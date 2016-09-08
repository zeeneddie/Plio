const ProblemGuidelineTypes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
};

const ProblemMagnitudes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
};

const ProblemsStatuses = {
  1: 'Open - just reported',
  2: 'Open - just reported, awaiting analysis',
  3: 'Open - just reported, awaiting action',
  4: 'Open - analysis due today',
  5: 'Open - analysis overdue',
  6: 'Open - analysis completed, action needed',
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
  20: 'Deleted'
};

const StandardStatuses = {
  'issued': 'Issued',
  'draft': 'Draft'
};

const AnalysisStatuses = {
  0: 'Not completed',
  1: 'Completed'
};

const ReviewStatuses = {
  0: 'Overdue',
  1: 'Awaiting review',
  2: 'Up-to-date'
};

const ProblemTypes = {
  NC: 'non-conformity',
  RISK: 'risk'
};

const ActionTypes = {
  CORRECTIVE_ACTION: 'CA',
  PREVENTATIVE_ACTION: 'PA',
  RISK_CONTROL: 'RC'
};

const WorkItemsStore = {
  TYPES: {
    COMPLETE_ACTION: 'complete action',
    VERIFY_ACTION: 'verify action',
    COMPLETE_ANALYSIS: 'complete analysis',
    COMPLETE_UPDATE_OF_STANDARDS: 'complete update of standards'
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

const ActionUndoTimeInHours = 1;

const ActionStatuses = {
  1: 'In progress',
  2: 'In progress - due for completion today',
  3: 'In progress - completion overdue',
  4: 'In progress - completed, not yet verified',
  5: 'In progress - completed, verification due today',
  6: 'In progress - completed, verification overdue',
  7: 'Completed - failed verification',
  8: 'Completed - verified as effective',
  9: 'Completed',
  10: 'Deleted'
};

const ActionPlanOptions = {
  YES: 'Yes',
  NO: 'No',
  NOT_NEEDED: 'Not needed'
};

const TimeUnits = {
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks'
};

const OrgCurrencies = {
  EUR: 'EUR',
  GBP: 'GBP',
  USD: 'USD'
};

const WorkflowTypes = {
  THREE_STEP: '3-step',
  SIX_STEP: '6-step'
};

const UserMembership = {
  ORG_OWNER: 'owner',
  ORG_MEMBER: 'member'
};

const UserRoles = {
  CREATE_UPDATE_DELETE_STANDARDS: 'create-update-delete-standards',
  VIEW_TEAM_ACTIONS: 'view-team-actions',
  INVITE_USERS: 'invite-users',
  DELETE_USERS: 'delete-users',
  EDIT_USER_ROLES: 'edit-user-roles',
  CHANGE_ORG_SETTINGS: 'change-org-settings'
};

const UserRolesNames = {
  [UserRoles.CREATE_UPDATE_DELETE_STANDARDS]: 'Create & edit standards documents',
  [UserRoles.VIEW_TEAM_ACTIONS]: 'View all Team actions',
  [UserRoles.INVITE_USERS]: 'Invite users',
  [UserRoles.DELETE_USERS]: 'Delete users',
  [UserRoles.EDIT_USER_ROLES]: 'Edit user superpowers',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Change organization settings'
};

const OrgOwnerRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS,
  UserRoles.INVITE_USERS,
  UserRoles.DELETE_USERS,
  UserRoles.EDIT_USER_ROLES,
  UserRoles.CHANGE_ORG_SETTINGS
];

const OrgMemberRoles = [
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  UserRoles.VIEW_TEAM_ACTIONS
];

const PhoneTypes = {
  WORK: 'Work',
  HOME: 'Home',
  MOBILE: 'Mobile'
};

const getDefaultGuideline = (type, problemType) => (
  `Please go to Org Settings to define what a ${type} ${problemType} means in your organization.`);

const OrganizationDefaults = {
  workflowDefaults: {
    minorProblem: {
      workflowType: WorkflowTypes.THREE_STEP,
      stepTime: {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      }
    },
    majorProblem: {
      workflowType: WorkflowTypes.SIX_STEP,
      stepTime: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    },
    criticalProblem: {
      workflowType: WorkflowTypes.SIX_STEP,
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
    minor: getDefaultGuideline(ProblemGuidelineTypes.MINOR, ProblemTypes.NC),
    major: getDefaultGuideline(ProblemGuidelineTypes.MAJOR, ProblemTypes.NC),
    critical: getDefaultGuideline(ProblemGuidelineTypes.CRITICAL, ProblemTypes.NC)
  },
  rkGuidelines: {
    minor: getDefaultGuideline(ProblemGuidelineTypes.MINOR, ProblemTypes.RISK),
    major: getDefaultGuideline(ProblemGuidelineTypes.MAJOR, ProblemTypes.RISK),
    critical: getDefaultGuideline(ProblemGuidelineTypes.CRITICAL, ProblemTypes.RISK)
  },
  rkScoringGuidelines: getDefaultGuideline('Risk scoring')
};

const DefaultStandardTypes = [
  {
    name: 'Policy',
    abbreviation: 'POL'
  },
  {
    name: 'Checklist',
    abbreviation: 'CHK'
  },
  {
    name: 'Standard Operating Procedure',
    abbreviation: 'SOP'
  },
  {
    name: 'Work instruction',
    abbreviation: 'WRK'
  },
  {
    name: 'Product specification',
    abbreviation: 'SPC'
  },
  {
    name: 'Test method',
    abbreviation: 'TST'
  },
  {
    name: 'Regulation',
    abbreviation: 'REG'
  },
  {
    name: 'Other',
    abbreviation: 'DOC'
  }
];

const StandardFilters = {
  1: 'section',
  2: 'type',
  3: 'deleted'
};

const DefaultRiskTypes = [
  {
    title: 'Industrial accident',
    abbreviation: 'IND'
  },
  {
    title: 'Strike or stoppage',
    abbreviation: 'STR'
  },
  {
    title: 'Technical failure',
    abbreviation: 'TFA'
  }
];

const RiskFilters = {
  1: 'type',
  2: 'status',
  3: 'department/sector',
  4: 'deleted'
};

const NonConformityFilters = {
  1: 'magnitude',
  2: 'status',
  3: 'department/sector',
  4: 'deleted'
};

const WorkInboxFilters = {
  1: 'My current work',
  2: 'Team current work',
  3: 'My completed work',
  4: 'Team completed work',
  5: 'My deleted work',
  6: 'Team deleted work'
};

const DocumentTypes = {
  STANDARD: 'standard',
  NON_CONFORMITY: 'non-conformity',
  RISK: 'risk'
};

const ActionDocumentTypes = {
  'ACTION': 'action',
  ...ProblemTypes
};

const AvatarPlaceholders = [
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
  'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/16.png'
];

const RiskEvaluationPriorities = {
  'low': 'Low',
  'medium': 'Medium',
  'high': 'High'
};

const RiskEvaluationDecisions = {
  'tolerate': 'Tolerate',
  'treat': 'Treat',
  'transfer': 'Transfer',
  'terminate': 'Terminate'
};

const CollectionNames = {
  STANDARDS: 'Standards',
  NCS: 'NonConformities',
  RISKS: 'Risks',
  ACTIONS: 'Actions',
  LESSONS: 'LessonsLearned',
  OCCURRENCES: 'Occurrences'
};

const TruncatedStringLengths = {
  c40: 40
};

const SystemName = 'Plio';

export {
  ActionTypes,
  ActionStatuses,
  ActionPlanOptions,
  ActionUndoTimeInHours,
  CollectionNames,
  DefaultStandardTypes,
  DefaultRiskTypes,
  ProblemGuidelineTypes,
  ProblemsStatuses,
  AnalysisStatuses,
  StandardStatuses,
  OrgCurrencies,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  PhoneTypes,
  StandardFilters,
  RiskFilters,
  NonConformityFilters,
  ProblemMagnitudes,
  ProblemTypes,
  TimeUnits,
  UserMembership,
  UserRoles,
  UserRolesNames,
  DocumentTypes,
  AvatarPlaceholders,
  WorkInboxFilters,
  ActionDocumentTypes,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions,
  ReviewStatuses,
  WorkItemsStore,
  RKTypes,
  TruncatedStringLengths,
  WorkflowTypes,
  SystemName,
  UnreadMessages
};
