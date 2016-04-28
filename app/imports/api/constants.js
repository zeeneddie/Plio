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

const UserRoles = {
  OWNER: 'owner',
  MEMBER: 'member'
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
  }
};

export {
  NCTypes,
  OrgCurrencies,
  OrganizationDefaults,
  TimeUnits,
  UserRoles
};
