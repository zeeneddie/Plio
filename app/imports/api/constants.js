const ProblemGuidelineTypes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
};

const ProblemsStatuses = {
  1: 'Open - just reported, awaiting analysis',
  2: 'Open - analysis due today',
  3: 'Open - analysis overdue',
  4: 'Open - analysis completed, action needed',
  5: 'Open - analysis completed, action(s) in place',
  6: 'Open - action(s) due today',
  7: 'Open - action(s) overdue',
  8: 'Open - action(s) completed, awaiting verification',
  9: 'Open - verification due today',
  10: 'Open - verification past due',
  11: 'Open - action(s) verified as effective, awaiting update of standard(s)',
  12: 'Open - action(s) failed verification',
  13: 'Closed - action(s) verified, standard(s) updated',
  14: 'Deleted'
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

const ActionUndoTimeInHours = 1;

const ActionStatuses = {
  0: 'In progress',
  1: 'In progress - due for completion today',
  2: 'In progress - completion overdue',
  3: 'In progress - completed, not yet verified',
  4: 'In progress - completed, verification due today',
  5: 'In progress - completed, verification overdue',
  6: 'Completed - failed verification',
  7: 'Completed - verified as effective',
  8: 'Completed - verified & standardized',
  9: 'Deleted'
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
    minorNc: {
      timeValue: 1,
      timeUnit: TimeUnits.DAYS
    },
    majorNc: {
      timeValue: 2,
      timeUnit: TimeUnits.DAYS
    },
    criticalNc: {
      timeValue: 3,
      timeUnit: TimeUnits.DAYS
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

const StandardFilters = [
  'section',
  'type',
  'deleted'
];

const RiskFilters = [
  'type',
  'status',
  'department/sector',
  'deleted'
];

const NonConformityFilters = [
  'magnitude',
  'status',
  'department/sector',
  'deleted'
];

const ActionFilters = [
  'My current actions',
  'Team current actions',
  'My completed actions',
  'Team completed actions'
];

const DocumentTypes = [
  'standard',
  'non-conformity',
  'risk'
];

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

export {
  ActionTypes,
  ActionStatuses,
  ActionPlanOptions,
  ActionUndoTimeInHours,
  DefaultStandardTypes,
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
  ProblemTypes,
  TimeUnits,
  UserMembership,
  UserRoles,
  UserRolesNames,
  DocumentTypes,
  AvatarPlaceholders,
  ActionFilters,
  ActionDocumentTypes,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions,
  ReviewStatuses,
  RKTypes
};
