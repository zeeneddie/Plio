import { __setupDB, __closeDB } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';
import { T } from 'ramda';

import createContext from '../../../utils/tests/createContext';
import ensureUserIsInRole from '../ensureUserIsInRole';

describe('Middleware/auth/ensureUserIsInRole', () => {
  let context;
  const next = jest.fn(T);

  beforeEach(Roles.__clear);
  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);

  it('throws if no role provided', async () => {
    const config = () => ({});
    const promise = ensureUserIsInRole(config)(next, {}, {}, context);

    await expect(promise).rejects.toEqual(expect.any(Error));
  });

  it('passes with a single role check', async () => {
    Roles.addUsersToRoles(context.userId, 'test');

    const config = () => ({ role: 'test' });
    const promise = ensureUserIsInRole(config)(next, {}, {}, context);

    await expect(promise).resolves.toBe(true);
  });
});
