import createContext from './createContext.e2e';

describe('e2e: sign-up', () => {
  const context = createContext({});

  beforeAll(async () => {
    page.setDefaultNavigationTimeout(process.env.DEFAULT_NAVIGATION_TIMEOUT);
    await context.connect();
    await context.clearDB();
  });

  it('registers new user', async () => {
    await page.goto(`${process.env.ROOT_URL}/sign-up`);
    await page.waitFor('#at-field-firstName');
    await page.type('#at-field-firstName', 'Hello');
    await page.type('#at-field-lastName', 'World');
    await page.type('#at-field-email', 'hello@world.com');
    await page.type('#at-field-password', 'password');
    await page.type('#at-field-password_again', 'password');
    await page.type('#at-field-organizationName', 'Hello World');
    await page.click('#at-btn');
    // eslint-disable-next-line max-len
    await expect(page).toMatch('The verification email has been sent to hello@world.com. It will expire in 3 days');
    const user = await context.execute(() => {
      const { Meteor } = require('meteor/meteor');
      return Meteor.users.findOne({ 'emails.address': 'hello@world.com' });
    });
    const { services: { email: { verificationTokens: [{ token }] } } } = user;
    await page.goto(`${process.env.ROOT_URL}/verify-email/${token}`);
    await expect(page).toMatch('Email verified! Thanks!');
  });
});
