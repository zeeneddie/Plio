import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/components';
import '/imports/ui/layouts';
import '/imports/ui/pages';

import { handleMethodResult } from '../../api/helpers.js';


AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/sign-in',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler
});

AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/sign-up',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler
});

FlowRouter.route('/accept-invitation/:invitationId', {
  name: 'acceptInvitationPage',
  action(params) {
    BlazeLayout.render('LoginLayout', {
      content: 'AcceptInvitationPage'
    });
  }
});

FlowRouter.route('/', {
  name: 'home',
  action(params) {
    BlazeLayout.render('LoginLayout');
  }
});

FlowRouter.route('/hello', {
  name: 'hello',
  action(params) {
    BlazeLayout.render('HelloPage');
  }
});

FlowRouter.route('/user-waiting', {
  name: 'userWaiting',
  action(params) {
    BlazeLayout.render('UserAccountWaitingPage');
  }
});

FlowRouter.route( '/verify-email/:token', {
  name: 'verifyEmail',
  action( params ) {
    Accounts.verifyEmail( params.token, handleMethodResult((err, res) => {
      if (!err) {
        toastr.success('Email verified! Thanks!', 'Success');
        FlowRouter.go('hello');
      }
    }));
  }
});

FlowRouter.route('/:orgSerialNumber/standards', {
  name: 'standards',
  action(params) {
    BlazeLayout.render('StandardLayout', {
      headerTitle: 'Standards book',
      contentList: 'StandardsList',
      contentCard: 'StandardsCard'
    });
  }
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('DashboardLayout', {
      content: 'DashboardPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/users', {
  name: 'userDirectoryPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('UserDirectoryLayout', {
      content: 'UserDirectoryPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/users/:userId', {
  name: 'userDirectoryUserPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('UserDirectoryLayout', {
      content: 'UserDirectoryPage'
    });
  }
});

function redirectHandler() {
  const orgSerialNumber = FlowRouter.getQueryParam('org');
  if (orgSerialNumber) {
    FlowRouter.go('dashboardPage', {orgSerialNumber});
  } else {
    FlowRouter.go('hello');
  }
}

function checkLoggedIn(context, redirect) {
  if (!Meteor.loggingIn()) {
    if (!Meteor.user()) {
      redirect('signIn', {}, {org: context.params.orgSerialNumber});
    }
  }
}

function checkEmailVerified(context, redirect) {
  const user = Meteor.user();
  const email = user.emails[0];
  if (!email.verified) {
    redirect('userWaiting', {});
  }
}