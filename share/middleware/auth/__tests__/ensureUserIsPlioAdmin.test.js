import { __setupDB, __closeDB } from 'meteor/mongo';
import { T } from 'ramda';

import ensureUserIsPlioAdmin from '../ensureUserIsPlioAdmin';
import Errors from '../../../errors';
import createContext from '../../../utils/tests/createContext';
import { UserMembership } from '../../../constants';

describe('Middleware/auth/ensureUserIsPlioAdmin', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);

  it('throws "not authorized" error if user is not plio master admin', async () => {
    const next = jest.fn();

    const promise = ensureUserIsPlioAdmin()(next, {}, {}, context);

    await expect(promise).rejects.toEqual(new Error(Errors.NOT_AUTHORIZED));
    expect(next).not.toHaveBeenCalled();
  });

  it('passes if user is plio master admin', async () => {
    const next = jest.fn(T);

    await context.collections.Organizations.insert({
      isAdminOrg: true,
      users: [
        { userId: context.userId, isRemoved: false, role: UserMembership.ORG_OWNER },
      ],
    });

    const promise = ensureUserIsPlioAdmin()(next, {}, {}, context);

    await expect(promise).resolves.toBe(true);
    expect(next).toHaveBeenCalled();
  });
});
