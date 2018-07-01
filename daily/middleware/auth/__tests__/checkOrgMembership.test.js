import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';
import { T } from 'ramda';

describe('checkOrgMembership', () => {
  const userId = 2;
  const organizationId = 1;

  beforeAll(async () => __setupDB());

  afterAll(async () => __closeDB());

  it('passes', async () => {
    jest.doMock('../../../collections', () => ({
      Organizations: new Mongo.Collection('organizations'),
    }));
    const { Organizations } = require('../../../collections');
    // jest.resetModules();
    const checkOrgMembership = require('../checkOrgMembership').default;
    const next = jest.fn(T);
    const root = {};
    const args = { organizationId };
    const context = { userId };

    await Organizations.insert({
      _id: organizationId,
      users: [{
        userId,
        isRemoved: false,
      }],
    });

    const actual = await checkOrgMembership()(next, root, args, context);

    expect(actual).toBe(true);
    expect(next).toHaveBeenCalledWith(root, args, context);
  });

  // it('throws', async () => {
  //   jest.doMock('../../../collections', () => ({
  //     Organizations: new Mongo.Collection('organizations'),
  //   }));
  //   const checkOrgMembership = require('../checkOrgMembership').default;
  //   const next = jest.fn(T);
  //   const root = {};
  //   const args = { organizationId };
  //   const context = { userId: 3 };
  //   const promise = checkOrgMembership()(next, root, args, context);
  //   await expect(promise).rejects.toEqual(new Error(403));
  // });
});
