import HandlebarsCache from '/imports/share/utils/handlebars-cache.js';


const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;

HandlebarsCache.addTemplates({
  defaultEmail: getAssetPath('email', 'default-email'),
  recapEmail: getAssetPath('email', 'recap-email'),
});
