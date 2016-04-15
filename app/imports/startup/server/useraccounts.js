import OrganizationService from '/imports/api/organizations/organization-service.js';


function postSignUpHook(userId, info) {
  const companyName = info.profile.companyName || 'My Organization';

  OrganizationService.insert({
    name: companyName,
    ownerId: userId
  });
}

AccountsTemplates.configure({ postSignUpHook });
