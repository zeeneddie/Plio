import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../../../../share/utils/tests/createContext';
import reassignUserOwnership from '../reassignUserOwnership';
import Errors from '../../../../../../share/errors';
import { UserMembership } from '../../../../../../share/constants';

describe('reassignUserOwnership', () => {
  let context;
  let args;
  const organizationId = faker.random.uuid();
  const userId = faker.random.uuid();

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
    args = { input: { organizationId, userId: context.userId, ownerId: userId } };

    context.services.UserService.reassignOwnership = jest.fn();
  });
  afterAll(__closeDB);
  beforeEach(async () => {
    context.services.UserService.reassignOwnership.mockClear();

    await __clearDB();
  });

  it('throws if userId is not org member', async () => {
    const promise = reassignUserOwnership({}, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.USER_NOT_ORG_MEMBER));
    expect(context.services.UserService.reassignOwnership).not.toHaveBeenCalled();
  });

  it('throws if ownerId is not org member', async () => {
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [context.userId],
    );

    const promise = reassignUserOwnership({}, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.USER_NOT_ORG_MEMBER));
    expect(context.services.UserService.reassignOwnership).not.toHaveBeenCalled();
  });

  it('throws if user reassigns ownership to himself', async () => {
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [context.userId, userId],
    );

    const _args = { input: { organizationId, userId: context.userId, ownerId: context.userId } };
    const promise = reassignUserOwnership({}, _args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.CANNOT_REASSIGN_OWNERSHIP_TO_YOURSELF));
    expect(context.services.UserService.reassignOwnership).not.toHaveBeenCalled();
  });

  it('reassigns ownership to organization owner if no ownerId provided', async () => {
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [context.userId, { userId, role: UserMembership.ORG_OWNER }],
    );

    const _args = { input: { organizationId, userId: context.userId } };
    await reassignUserOwnership({}, _args, context);

    expect(context.services.UserService.reassignOwnership).toHaveBeenCalledWith({
      organizationId,
      userId: context.userId,
      ownerId: userId,
    }, expect.any(Object));
  });

  it('works', async () => {
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [context.userId, userId],
    );

    const promise = reassignUserOwnership({}, args, context);

    await expect(promise).resolves.toBe(null);
    expect(context.services.UserService.reassignOwnership).toHaveBeenCalledTimes(1);
  });
});
