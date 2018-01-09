import { times } from 'ramda';

export const genUser = n => ({
  _id: n,
  status: 'online',
  profile: {
    firstName: `John ${n}`,
    lastName: `Doe ${n}`,
  },
});

export const genUsers = times(genUser);
