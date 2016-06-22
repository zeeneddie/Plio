const NCTypes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
};

const ProblemsStatuses = {
  1: 'Open - just reported',
  2: 'Open - analysis due today',
  3: 'Open - analysis overdue',
  4: 'Open - analysis completed, action needed',
  5: 'Open - analysis completed, action in place',
  6: 'Open - action due today',
  7: 'Open - action overdue',
  8: 'Open - action completed',
  9: 'Open - verification due today',
  10: 'Open - verification overdue',
  11: 'Open - action verified as effective',
  12: 'Open - action failed verification',
  13: 'Closed - action verified, standard updated',
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

const getDefaultGuideline = (ncType) => {
  return `Please go to Org Settings to define what a ${ncType} `
    + `non-conformity means in your organization.`;
};

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
    minor: getDefaultGuideline(NCTypes.MINOR),
    major: getDefaultGuideline(NCTypes.MAJOR),
    critical: getDefaultGuideline(NCTypes.CRITICAL)
  }
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
  'department',
  'deleted'
];

const NonConformityFilters = [
  'magnitude',
  'status',
  'department',
  'deleted'
];

const ProblemTypes = [
  'non-conformity',
  'risk'
];

const DocumentTypes = [
  'standard',
  'non-conformity',
  'risk'
];

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
]

export {
  DefaultStandardTypes,
  NCTypes,
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
  AvatarPlaceholders
};
