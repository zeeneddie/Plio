AccountsTemplates.configure({
  sendVerificationEmail: true,
  showResendVerificationEmailLink: true,
  showValidating: true,
  enablePasswordChange: true,
  showForgotPasswordLink: true,
  negativeValidation: true,
  positiveValidation: true,
  homeRoutePath: '/',
  texts: {
    errors: {
      loginForbidden: 'Incorrect login details - please try again'
    }
  }
});