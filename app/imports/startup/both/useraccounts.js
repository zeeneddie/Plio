AccountsTemplates.configure({
  sendVerificationEmail: true,
  showResendVerificationEmailLink: true,
  showValidating: true,
  enablePasswordChange: true,
  showForgotPasswordLink: true,
  negativeValidation: true,
  positiveValidation: false,
  homeRoutePath: '/',
  texts: {
    errors: {
      loginForbidden: 'Incorrect login details - please try again',
    },
  },
});
