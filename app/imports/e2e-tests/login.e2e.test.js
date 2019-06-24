import createContext from './createContext.e2e';

describe('e2e: login', () => {
  const context = createContext({});

  beforeAll(async () => {
    await page.setDefaultNavigationTimeout(process.env.DEFAULT_NAVIGATION_TIMEOUT);
    await context.connect();
    await context.clearDB();
    await context.registerUsers();
    await context.verifyEmails();
    await context.createFixtures();
  });

  it('logs user in', async () => {
    const user = context.state.users[0];
    await page.goto(`${process.env.ROOT_URL}/login`);
    await page.waitFor('#at-field-email');
    await page.type('#at-field-email', user.email);
    await page.type('#at-field-password', user.password);
    await page.click('#at-btn');
    await expect(page).toMatch('Sorry, your account is not associated with any organization.');
    await expect(page).toClick('a', { text: 'You can create a new organization' });
    await page.waitFor('[name="name"]');
    await page.type('[name="name"]', 'Hello World');
    await expect(page).toClick('.Select-arrow-zone');
    await page.waitFor(500);
    await page.keyboard.press('Enter');
    await page.$eval('form', form => form.dispatchEvent(new Event('submit', { cancelable: true })));
    await expect(page).toMatchElement('#DashboardPage');
  });
});
