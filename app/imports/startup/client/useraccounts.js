AccountsTemplates.configure({
  sendVerificationEmail: false,
  negativeValidation: true,
  positiveValidation: true,
  homeRoutePath: '/',
  texts: {
    signInLink_pre: "Already have an account?",
    signInLink_link: "Login",
    title: {
      signUp: 'Sign up for a Plio account',
      signIn: 'Login'
    },
    button: {
      signUp: 'Sign up',
      signIn: 'Login'
    }
  }
});

const email = AccountsTemplates.removeField('email');
const password = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
  _id: 'firstName',
  type: 'text',
  displayName: 'First name',
  placeholder: 'First name',
  required: true,
  minLength: 1,
  maxLength: 40
});

AccountsTemplates.addField({
  _id: 'lastName',
  type: 'text',
  displayName: 'Last name',
  placeholder: 'Last name',
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
