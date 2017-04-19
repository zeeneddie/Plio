import HandlebarsCache from '/imports/share/utils/handlebars-cache';


const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;

HandlebarsCache.addTemplates({
  defaultEmail: getAssetPath('email', 'default-email'),
  recapEmail: getAssetPath('email', 'recap-email'),
  reviewEmailTestSummary: getAssetPath('email', 'review-email-test-summary'),
});
