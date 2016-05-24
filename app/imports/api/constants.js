const NCTypes = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical'
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
  ncStepTimes: {
    minor: {
      timeValue: 1,
      timeUnit: TimeUnits.DAYS
    },
    major : {
      timeValue: 2,
      timeUnit: TimeUnits.DAYS
    },
    critical: {
      timeValue: 3,
      timeUnit: TimeUnits.DAYS
    }
  },
  ncReminders: {
    minor: {
      interval : {
        timeValue: 1,
        timeUnit: TimeUnits.DAYS
      },
      pastDue: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      }
    },
    major: {
      interval: {
        timeValue: 2,
        timeUnit: TimeUnits.DAYS
      },
      pastDue: {
        timeValue: 4,
        timeUnit: TimeUnits.DAYS
      }
    },
    critical: {
      pastDue: {
        timeValue: 6,
        timeUnit: TimeUnits.DAYS
      },
      interval: {
        timeValue: 3,
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
    name: 'Product specification',
    abbreviation: 'SPC'
  },
  {
    name: 'Regulation',
    abbreviation: 'REG'
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
    name: 'Test method',
    abbreviation: 'TST'
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

export {
  DefaultStandardTypes,
  NCTypes,
  OrgCurrencies,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  PhoneTypes,
  StandardFilters,
  TimeUnits,
  UserMembership,
  UserRoles,
  UserRolesNames
};
