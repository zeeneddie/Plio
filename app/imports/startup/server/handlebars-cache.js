import HandlebarsCache from '/imports/share/utils/handlebars-cache.js';


const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;

HandlebarsCache.addTemplates({
  minimalisticEmail: getAssetPath('email', 'minimalistic-email'),
  personalEmail: getAssetPath('email', 'personal-email'),
});
