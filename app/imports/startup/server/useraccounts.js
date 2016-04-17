import OrganizationService from '/imports/api/organizations/organization-service.js';


function postSignUpHook(userId, info) {
  const companyName = info.profile.companyName || 'My Organization';

  OrganizationService.insert({
    name: companyName,
    users: [{
      userId,
      role: UserRoles.OWNER
    }],
    currency: 'USD',
    ownerId: userId,
    ncStepTimes: {
      minor: {
        timeUnit: 'days',
        timeValue: 13
      },
      major: {
        timeUnit: 'hours',
        timeValue: 6
      },
      critical: {
        timeUnit: 'weeks',
        timeValue: 43
      }
    },
    ncReminders: {
      minor: {
        interval: {
          timeUnit: 'weeks',
          timeValue: 12
        },
        pastDue: {
          timeUnit: 'hours',
          timeValue: 87
        }
      },
      major: {
        interval: {
          timeUnit: 'days',
          timeValue: 17
        },
        pastDue: {
          timeUnit: 'weeks',
          timeValue: 1
        }
      },
      critical: {
        interval: {
          timeUnit: 'hours',
          timeValue: 34
        },
        pastDue: {
          timeUnit: 'weeks',
          timeValue: 3
        }
      }
    },
    ncGuidelines: {
      minor: 'minor guideline',
      major: 'major guideline',
      critical: 'critical guideline'
    }
  });
}

AccountsTemplates.configure({ postSignUpHook });
