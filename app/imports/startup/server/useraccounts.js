import { Organizations } from '/imports/api/organizations/organizations.js';
import { UserRoles } from '/imports/api/constants.js';


function postSignUpHook(userId, info) {
  const companyName = info.profile.companyName || 'My Organization';

  Organizations.insert({
    name: companyName,
    users: [{
      userId,
      role: UserRoles.OWNER
    }]
  });
}

AccountsTemplates.configure({ postSignUpHook });
