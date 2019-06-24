import createContext from './createContext.e2e';
import { DEFAULT_TEMPLATE_ORGANIZATION_ID, UserMembership } from '../share/constants';

describe('e2e: organization creation', () => {
  const context = createContext({});

  beforeAll(async () => {
    await page.setDefaultNavigationTimeout(process.env.DEFAULT_NAVIGATION_TIMEOUT);
    await context.connect();
    await context.clearDB();
    await context.registerUsers();
    await context.verifyEmails();
    await context.createFixtures({
      user: context.state.users[0],
    });
  });

  it('creates new organization from dashboard menu', async () => {
    await page.goto(`${process.env.ROOT_URL}/hello`);
    await context.login();
    await expect(page).toClick('#OrganizationMenu .dropdown-toggle');
    await expect(page).toClick('button.dropdown-item', { text: 'Create new Plio organization' });
    await page.waitFor('[name="name"]');
    await page.type('[name="name"]', 'Hello World');
    await expect(page).toClick('.Select-arrow-zone');
    await page.waitFor(500);
    await page.keyboard.press('Enter');
    await page.$eval('form', form => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await page.waitFor(3000);
    await expect(page.url()).toMatch('/101');
    const promise = context.execute(() => {
      const { Organizations } = require('/imports/share/collections');
      return {
        count: Organizations.find({}).count(),
        organization: Organizations.findOne({ serialNumber: 101 }),
      };
    });
    await expect(promise).resolves.toEqual(expect.objectContaining({
      count: 2,
      organization: expect.objectContaining({
        name: 'Hello World',
        templateId: DEFAULT_TEMPLATE_ORGANIZATION_ID,
        users: [
          expect.objectContaining({
            userId: context.state.users[0]._id,
            role: UserMembership.ORG_OWNER,
          }),
        ],
      }),
    }));
  });
});
