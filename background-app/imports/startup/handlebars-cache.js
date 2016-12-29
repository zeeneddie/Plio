import EmailTemplates from '/imports/share/utils/email-templates';


const getAssetPath = (name) => `email-templates/${name}.handlebars`;

EmailTemplates.addTemplates({
  defaultEmail: getAssetPath('default-email'),
  recapEmail: getAssetPath('recap-email'),
});
