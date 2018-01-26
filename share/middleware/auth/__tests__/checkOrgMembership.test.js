import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { T } from 'ramda';
import { createOrgQueryWhereUserIsMember } from '../../../mongo';

describe('checkOrgMembership', () => {
  const userId = 2;
  const organizationId = 1;

  beforeEach(async () => {
    await __setupDB();
    jest.doMock('../../../collections', () => ({
      Organizations: new Mongo.Collection('organizations'),
    }));
    const { Organizations } = require('../../../collections');

    await Organizations.insert({
      _id: organizationId,
      users: [createOrgQueryWhereUserIsMember(userId)],
    });
  });

  afterEach(async () => __closeDB());

  it('passes', async () => {
    const checkOrgMembership = require('../checkOrgMembership').default();
    const next = jest.fn(T);
    const root = {};
    const args = { organizationId };
    const context = { userId };
    const actual = await checkOrgMembership(next, root, args, context);

    expect(actual).toBe(true);
    expect(next).toHaveBeenCalledWith(root, args, context);
  });

  // throws ??????
  // it('throws', async () => {
  //   const next = jest.fn(T);
  //   const root = {};
  //   const args = { organizationId };
  //   const context = { userId: 3 };
  //   const promise = checkOrgMembership()(next, root, args, context);
  //   await expect(promise).rejects.toEqual(new Error(403));
  // });
});
