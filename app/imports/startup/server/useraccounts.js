import Organizations from '/imports/api/organizations/organizations.js';
import { UserRoles } from '/imports/api/constants.js';


function postSignUpHook(userId, info) {
  const companyName = info.profile.companyName;
  const org = Organizations.findOne({
    name: companyName
  });

  let orgId = org ? org._id : null;
  const userDoc = {
    userId,
    role: UserRoles.OWNER
  };

  if (!orgId) {
    Organizations.insert({
      name: companyName,
      users: [userDoc]
    });
  } else {
    Organizations.update({
      _id: orgId
    }, {
      $push: {
        users: userDoc
      }
    });
  }
}

AccountsTemplates.configure({
  postSignUpHook: postSignUpHook
});
