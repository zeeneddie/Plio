import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../../../../../share/utils/tests/createContext';
import { CustomerTypes } from '../../../../../../share/constants';
import updateOrganization from '../updateOrganization';

describe('Mutation/updateOrganization', () => {
  let context;
  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('throws if regular user tries to update admin-only fields', async () => {
    const organizationId = faker.random.uuid();
    const args = {
      input: {
        _id: organizationId,
        customerType: CustomerTypes.PAYING_SUBSCRIBER,
      },
    };

    await context.collections.Organizations.addMembers({
      _id: organizationId,
    }, [{ userId: context.userId }]);

    await expect(updateOrganization({}, args, context)).rejects.toEqual(expect.any(Error));
  });

  it('does not throw if admin tries to update admin-only fields', async () => {
    const organizationId = faker.random.uuid();
    const args = {
      input: {
        _id: organizationId,
        customerType: CustomerTypes.PAYING_SUBSCRIBER,
      },
    };

    await context.collections.Organizations.addMembers({
      _id: organizationId,
      isAdminOrg: true,
      customerType: CustomerTypes.FREE_TRIAL,
    }, [{ userId: context.userId }]);

    await expect(updateOrganization({}, args, context)).resolves.toEqual(expect.anything());

    const promise = context.collections.Organizations.findOne({ _id: organizationId });
    await expect(promise).resolves.toMatchObject({
      customerType: CustomerTypes.PAYING_SUBSCRIBER,
    });
  });
});
