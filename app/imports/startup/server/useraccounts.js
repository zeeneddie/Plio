import OrganizationService from '/imports/api/organizations/organization-service.js';


function postSignUpHook(userId, info) {
  const organizationName = info.profile.organizationName || 'My Organization';

  OrganizationService.insert({
    name: organizationName,
    ownerId: userId
  });
}

AccountsTemplates.configure({ 
  postSignUpHook
});
