import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';

import createContext from '../../utils/tests/createContext';
import OrganizationService from '../organization-service';
import { CustomerTypes, UserMembership } from '../../constants';

describe('Organization service', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  describe('importFromTemplate', () => {
    it('throws if template organization does not exist', async () => {
      const to = await context.collections.Organizations.insert({});
      const args = { to, from: faker.random.uuid() };
      const promise = OrganizationService.importFromTemplate(args, context);
      await expect(promise).rejects.toEqual(expect.any(Error));
    });

    it('throws if origin organization does not exist', async () => {
      const from = await context.collections.Organizations.insert({});
      const args = { to: faker.random.uuid(), from };
      const promise = OrganizationService.importFromTemplate(args, context);
      await expect(promise).rejects.toEqual(expect.any(Error));
    });

    it('imports documents from template organization', async () => {
      const to = faker.random.uuid();

      const organizationId = await context.collections.Organizations.insert({
        customerType: CustomerTypes.TEMPLATE,
      });
      await context.collections.Organizations.addMembers({ _id: to }, [
        {
          role: UserMembership.ORG_OWNER,
          userId: context.userId,
        },
      ]);

      await Promise.all([
        context.collections.StandardTypes.insert({
          organizationId,
          title: 'hello world',
          abbreviation: 'HW',
        }),
        context.collections.StandardsBookSections.insert({
          organizationId,
          title: 'hello world',
        }),
        context.collections.RiskTypes.insert({
          organizationId,
          title: 'hello world',
        }),
      ]);

      const args = { to, from: organizationId };
      const query = { organizationId: to };

      await OrganizationService.importFromTemplate(args, context);

      await expect(context.collections.StandardTypes.find(query).fetch()).resolves.toMatchObject([
        {
          organizationId: to,
          title: 'hello world',
          abbreviation: 'HW',
        },
      ]);
      await expect(
        context.collections.StandardsBookSections.find(query).fetch(),
      ).resolves.toMatchObject([
        {
          organizationId: to,
          title: 'hello world',
        },
      ]);
      await expect(context.collections.RiskTypes.find(query).fetch()).resolves.toMatchObject([
        {
          organizationId: to,
          title: 'hello world',
        },
      ]);
    });
  });
});
