AccountsTemplates.configure({
  sendVerificationEmail: false,
  negativeValidation: true,
  positiveValidation: true,
  homeRoutePath: '/'
});

const email = AccountsTemplates.removeField('email');
const password = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
  _id: 'fullName',
  type: 'text',
  displayName: 'Full name',
  placeholder: 'Full name',
  required: true,
  minLength: 1,
  maxLength: 40
});

AccountsTemplates.addField(email);
AccountsTemplates.addField(password);

AccountsTemplates.addField({
  _id: 'companyName',
  type: 'text',
  displayName: 'Company name',
  placeholder: 'Company name',
  required: true,
  minLength: 1,
  maxLength: 40
});
