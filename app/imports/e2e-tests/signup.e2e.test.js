import createContext from './createContext.e2e';

describe('e2e: sign-up', () => {
  const context = createContext({});

  beforeAll(async () => {
    page.setDefaultNavigationTimeout(process.env.DEFAULT_NAVIGATION_TIMEOUT);
    await context.connect();
    await context.clearDB();
  });

  it('registers new user and imports document from "General purpose" organization', async () => {
    await context.registerUsers();
    await context.createFixtures();
    await context.execute(async (userId) => {
      const { DEFAULT_TEMPLATE_ORGANIZATION_ID } = require('/imports/share/constants');
      const { Organizations } = require('/imports/share/collections');
      const {
        default: StandardSectionService,
      } = require('/imports/api/standards-book-sections/standards-book-section-service');
      const {
        default: StandardTypeService,
      } = require('/imports/api/standards-types/standards-type-service');
      const {
        default: RiskTypeService,
      } = require('/imports/api/risk-types/risk-types-service');
      const templ = Organizations.findOne({ _id: DEFAULT_TEMPLATE_ORGANIZATION_ID });
      const organizationId = templ._id;
      StandardSectionService.insert({
        organizationId,
        title: 'Template',
      }, { userId });
      StandardTypeService.insert({
        organizationId,
        title: 'Template',
        abbreviation: 'TPL',
        createdBy: userId,
      });
      RiskTypeService.insert({
        organizationId,
        title: 'Template',
        abbreviation: 'TPL',
      });
    }, context.state.users[1]._id);
    await page.goto(`${process.env.ROOT_URL}/sign-up`);
    await page.waitFor('#at-field-firstName');
    await page.type('#at-field-firstName', 'Hello');
    await page.type('#at-field-lastName', 'World');
    await page.type('#at-field-email', 'john@doe.com');
    await page.type('#at-field-password', 'password');
    await page.type('#at-field-password_again', 'password');
    await page.type('#at-field-organizationName', 'Hello World');
    await page.click('#at-btn');
    // eslint-disable-next-line max-len
    await expect(page).toMatch('The verification email has been sent to john@doe.com. It will expire in 3 days');
    const user = await context.execute(() => {
      const { Meteor } = require('meteor/meteor');
      return Meteor.users.findOne({ 'emails.address': 'john@doe.com' });
    });
    const { services: { email: { verificationTokens: [{ token }] } } } = user;
    await page.goto(`${process.env.ROOT_URL}/verify-email/${token}`);
    await expect(page).toMatch('Email verified! Thanks!');
    const docs = await context.execute(async () => {
      const {
        Organizations,
        StandardsBookSections,
        StandardTypes,
        RiskTypes,
      } = require('/imports/share/collections');
      const organization = Organizations.findOne({ name: 'Hello World' });
      const organizationId = organization._id;
      return [
        StandardsBookSections.findOne({ organizationId, title: 'Template' }),
        StandardTypes.findOne({ organizationId, title: 'Template' }),
        RiskTypes.findOne({ organizationId, title: 'Template' }),
      ];
    });

    docs.forEach(doc => expect(doc).toEqual(expect.anything()));
  });
});
