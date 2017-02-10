import { _ } from 'meteor/underscore';

function formatUser(user) {
  if (!user) return null;

  const { profile, emails } = user;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return fullName.replace(' ', '') && fullName || emails && _.first(emails).address;
}

export { formatUser };
