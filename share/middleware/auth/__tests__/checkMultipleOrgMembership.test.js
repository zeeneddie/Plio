import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import { times, identity, T } from 'ramda';
import faker from 'faker';

import createContext from '../../../utils/tests/createContext';
import checkMultipleOrgMembership from '../checkMultipleOrgMembership';

describe('checkMultipleOrgMembership', () => {
  const root = {};
  const args = {
    organizationId: faker.random.uuid(),
    userIds: times(faker.random.uuid, 2),
  };
  let context;

  beforeAll(async () => {
    await __setupDB();
    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('throws if no userIds provided', async () => {
    const promise = checkMultipleOrgMembership()(identity, {}, {}, {});

    await expect(promise).rejects.toEqual(expect.any(Error));
  });

  it('throws if some user is not a member of organization', async () => {
    await context.collections.Organizations.insert({
      _id: args.organizationId,
      users: [
        { userId: args.userIds[0], isRemoved: false },
      ],
    });

    const promise = checkMultipleOrgMembership(
      (_, { userIds }) => ({ userIds }),
    )(T, root, args, context);

    await expect(promise).rejects.toEqual(expect.any(Error));
  });

  it('passes if userIds provided', async () => {
    await context.collections.Organizations.insert({
      _id: args.organizationId,
      users: [
        { userId: args.userIds[0], isRemoved: false },
        { userId: args.userIds[1], isRemoved: false },
      ],
    });

    const promise = checkMultipleOrgMembership(
      (_, { userIds }) => ({ userIds }),
    )(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
