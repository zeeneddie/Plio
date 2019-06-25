import createContext from './createContext.e2e';

describe('e2e: sign-up with template', () => {
  const context = createContext({});

  beforeAll(async () => {
    page.setDefaultNavigationTimeout(process.env.DEFAULT_NAVIGATION_TIMEOUT);
    await context.connect();
    await context.clearDB();
  });

  it('registers new user and imports documents from template organization', async () => {
    await context.registerUsers();
    await context.createFixtures();
    const template = await context.execute((userId) => {
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
      const { CustomerTypes } = require('/imports/share/constants');
      const templ = Organizations.findOne({
        customerType: CustomerTypes.TEMPLATE,
        signupPath: { $exists: true },
      });
      StandardSectionService.insert({
        organizationId: templ._id,
        title: 'Template',
      }, { userId });
      StandardTypeService.insert({
        organizationId: templ._id,
        title: 'Template',
        abbreviation: 'TPL',
        createdBy: userId,
      });
      RiskTypeService.insert({
        organizationId: templ._id,
        title: 'Template',
        abbreviation: 'TPL',
      });
      return templ;
    }, context.state.users[1]._id);
    await page.goto(`${process.env.ROOT_URL}/sign-up?template=${template.signupPath}`);
    await expect(page).toMatch(template.name);
    await page.waitFor('#at-field-firstName');
    await page.type('#at-field-firstName', 'Hello');
    await page.type('#at-field-lastName', 'World');
    await page.type('#at-field-email', 'john@doe.com');
    await page.type('#at-field-password', 'password');
    await page.type('#at-field-password_again', 'password');
    await page.type('#at-field-organizationName', 'Hello World');
    await page.click('#at-btn');
    await page.waitFor(3000);
    const docs = await context.execute(() => {
      const {
        Organizations,
        StandardsBookSections,
        StandardTypes,
        RiskTypes,
      } = require('/imports/share/collections');
      const { _id: organizationId } = Organizations.findOne({ name: 'Hello World' });
      return [
        StandardsBookSections.findOne({ organizationId, title: 'Template' }),
        StandardTypes.findOne({ organizationId, title: 'Template' }),
        RiskTypes.findOne({ organizationId, title: 'Template' }),
      ];
    });
    docs.forEach(doc => expect(doc).toEqual(expect.anything()));
  });
});
