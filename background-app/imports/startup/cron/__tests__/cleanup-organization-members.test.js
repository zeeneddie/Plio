import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import createContext from '../../../share/utils/tests/createContext';

describe('Cron: cleanup organization members', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    Meteor.users = context.collections.Users;
    jest.doMock('../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('removes organization members that are no longer plio users', async () => {
    const { job } = require('../cleanup-organization-members');
    const _id = await context.collections.Organizations.insert({
      users: [
        { userId: 1 },
        { userId: 2 },
        { userId: 3 },
      ],
    });

    await context.collections.Users.rawCollection().insertMany([
      { _id: 1 },
      { _id: 3 },
    ]);

    await job();

    const organization = await context.collections.Organizations.findOne({ _id });

    expect(organization.users).toEqual([
      { userId: 1 },
      { userId: 3 },
    ]);
  });
});
