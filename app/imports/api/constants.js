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
  DELETE_USERS: 'delete-users',
  INVITE_USERS: 'invite-users',
  EDIT_USER_PERMISSIONS: 'edit-user-permissions',
  CHANGE_ORG_SETTINGS: 'change-org-settings',
  VIEW_TEAM_TO_DO_LISTS: 'view-team-to-do-lists',
  CREATE_AND_EDIT_STANDARDS_DOCUMENTS: 'create-and-edit-standards-documents'
};

const UserRolesNames = {
  [UserRoles.DELETE_USERS]: 'Delete users',
  [UserRoles.INVITE_USERS]: 'Invite users',
  [UserRoles.EDIT_USER_PERMISSIONS]: 'Edit user permissions',
  [UserRoles.CHANGE_ORG_SETTINGS]: 'Change organization settings',
  [UserRoles.VIEW_TEAM_TO_DO_LISTS]: 'View team to do lists',
  [UserRoles.CREATE_AND_EDIT_STANDARDS_DOCUMENTS]: 'Create & edit standards documents'
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

export {
  NCTypes,
  OrgCurrencies,
  OrganizationDefaults,
  TimeUnits,
  UserMembership,
  UserRoles,
  UserRolesNames
};
