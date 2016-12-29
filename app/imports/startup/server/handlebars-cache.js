import EmailTemplates from '/imports/share/utils/email-templates';


const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;

EmailTemplates.addTemplates({
  minimalisticEmail: getAssetPath('email', 'minimalistic-email'),
  personalEmail: getAssetPath('email', 'personal-email')
});
