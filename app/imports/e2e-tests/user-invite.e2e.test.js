import createContext from './createContext.e2e';

describe('e2e: user invite', () => {
  const context = createContext({});

  beforeAll(async () => {
    page.setDefaultNavigationTimeout(process.env.DEFAULT_NAVIGATION_TIMEOUT);
    await context.connect();
  });

  beforeEach(async () => {
    const { DEFAULT_TEMPLATE_ORGANIZATION_ID } = require('../share/constants');
    await context.clearDB();
    await context.registerUsers();
    await context.verifyEmails();
    await context.createFixtures();
    await context.createOrganization({
      name: 'Hello World',
      ownerId: context.state.users[0]._id,
      templateId: DEFAULT_TEMPLATE_ORGANIZATION_ID,
    });
    await page.goto(`${process.env.ROOT_URL}/hello`);
    await context.login();
    await expect(page).toClick('.btn', { text: 'Invite users' });
    await page.waitFor(3000);
    await page.waitFor('input[name="options[0].value"]');
  });

  it('invites user to organization', async () => {
    await expect(page).toFill('input[name="options[0].value"]', 'user@to.invite.com');
    await page.$eval('form', form => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await expect(page).toMatch('Invite to user@to.invite.com was sent successfully');
  });

  it('Invites multiple users to organization', async () => {
    await expect(page).toFillForm('form', {
      'options[0].value': 'user@to.invite2.com',
      'options[1].value': 'user@to.invite3.com',
    });
    await page.$eval('form', form => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await expect(page).toMatch(
      'Invites to user@to.invite2.com, user@to.invite3.com were sent successfully',
    );
  });

  it('throws if email is not valid', async () => {
    await expect(page).toFillForm('form', {
      'options[0].value': 'user@to.invite4.com',
      'options[1].value': 'invalid.email.address',
    });
    await page.$eval('form', form => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await expect(page).toMatch('"invalid.email.address" must be a valid e-mail address');
  });

  it('sends url with template sign-up path on user invite email', async () => {
    await expect(page).toFill('input[name="options[0].value"]', 'user@to.invite.com');
    await context.state.ddp.call('emails/stub');
    await page.$eval('form', form => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await page.waitFor(3000);
    const emails = await context.state.ddp.call('emails/get', {});
    const template = await context.execute(async () => {
      const { Organizations } = require('/imports/share/collections');
      const { DEFAULT_TEMPLATE_ORGANIZATION_ID } = require('/imports/share/constants');
      return Organizations.findOne({ _id: DEFAULT_TEMPLATE_ORGANIZATION_ID });
    });
    expect(emails[0].html).toMatch(`template%3D${template.signupPath}`);
  });
});
