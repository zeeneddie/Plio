AccountsTemplates.configure({
  sendVerificationEmail: false,
  negativeValidation: true,
  positiveValidation: true,
  homeRoutePath: '/',
  texts: {
    title: {
      signUp: 'Create an Organization Account'
    }
  }
});

const email = AccountsTemplates.removeField('email');
const password = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
  _id: 'firstName',
  type: 'text',
  displayName: 'First Name',
  placeholder: 'First Name',
  required: true,
  minLength: 1,
  maxLength: 40
});

AccountsTemplates.addField({
  _id: 'lastName',
  type: 'text',
  displayName: 'Last Name',
  placeholder: 'Last Name',
  required: true,
  minLength: 1,
  maxLength: 40
});

AccountsTemplates.addField(email);
AccountsTemplates.addField(password);

AccountsTemplates.addField({
  _id: 'organizationName',
  type: 'text',
  displayName: 'Organization name',
  placeholder: 'Organization name',
  required: true,
  minLength: 1,
  maxLength: 40
});
