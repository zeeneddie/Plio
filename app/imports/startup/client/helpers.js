import {Meteor} from 'meteor/meteor';

Template.registerHelper('userFullNameOrEmail', (userOrUserId) => {
  let user = userOrUserId;
  if (typeof userOrUserId === 'string') {
    user = Meteor.users.findOne(userOrUserId);
  }
  
  const {firstName='', lastName=''} = user.profile;
  if (firstName && lastName)
    return `${firstName} ${lastName}`;
  else
    return user.emails[0].address;
});