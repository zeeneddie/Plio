import moment from 'moment-timezone';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import { Organizations } from '../../share/collections';

AccountsTemplates.configure({
  texts: {
    signInLink_pre: 'Already have an account?',
    signInLink_link: 'Login',
    title: {
      signUp: 'Sign up for a Plio account - 30 day free trial',
      signIn: 'Login',
    },
    button: {
      signUp: 'Sign up/Signing up...',
      signIn: 'Login/Logging in...',
      changePwd: 'Change password/Changing password...',
      forgotPwd: 'Email me reset instructions/Sending email...',
    },
    info: {
      emailSent: 'info.emailSent',
      emailVerified: 'info.emailVerified',
      pwdChanged: 'info.passwordChanged',
      pwdReset: 'info.passwordReset',
      pwdSet: 'info.passwordReset',
      signUpVerifyEmail:
        'Successful Registration! Please check your email and follow the instructions.',
      verificationEmailSent: 'A new email has been sent to you. If the email doesn\'t ' +
        'show up in your inbox, be sure to check your spam folder.',
    },
  },
});

AccountsTemplates.removeField('email');
const password = AccountsTemplates.removeField('password');

AccountsTemplates.addField({
  _id: 'firstName',
  type: 'text',
  displayName: 'First name',
  placeholder: 'First name',
  required: true,
  minLength: 1,
  maxLength: 40,
  transform(value) {
    return value.capitalize();
  },
});

AccountsTemplates.addField({
  _id: 'lastName',
  type: 'text',
  displayName: 'Last name',
  placeholder: 'Last name',
  required: true,
  minLength: 1,
  maxLength: 40,
  transform(value) {
    return value.capitalize();
  },
});

AccountsTemplates.addField({
  _id: 'email',
  type: 'email',
  required: true,
  displayName: 'email',
  re: /.+@(.+){2,}\.(?!con)(.+){2,}/,
  errStr: 'Invalid email',
});

AccountsTemplates.addField(password);

AccountsTemplates.addField({
  _id: 'organizationName',
  type: 'text',
  displayName: 'Organization name',
  placeholder: 'Organization name',
  required: true,
  minLength: 1,
  maxLength: 40,
});

AccountsTemplates.configure({
  preSignUpHook(userPassword, info) {
    const template = FlowRouter.getQueryParam('template');
    const templateOrg = Organizations.findOne({ signupPath: template });

    Object.assign(info.profile, {
      organizationHomeScreen: FlowRouter.getQueryParam('type'),
      organizationTimezone: moment.tz.guess(),
      organizationTemplate: templateOrg ? templateOrg._id : undefined,
    });
  },
});
