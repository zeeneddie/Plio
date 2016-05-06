AccountsTemplates.configure({
  sendVerificationEmail: true,
  enforceEmailVerification: false,
  showResendVerificationEmailLink: true,

  enablePasswordChange: true,
  showForgotPasswordLink: true,

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
    },
    info: {
      emailSent: 'info.emailSent',
      emailVerified: 'info.emailVerified',
      pwdChanged: 'info.passwordChanged',
      pwdReset: 'info.passwordReset',
      pwdSet: 'info.passwordReset',
      signUpVerifyEmail: 'Successful Registration! Please check your email and follow the instructions.',
      verificationEmailSent: 'A new email has been sent to you. If the email doesn\'t show up in your inbox, be sure to check your spam folder.',
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
