import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/components';
import '/imports/ui/layouts';
import '/imports/ui/pages';

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

FlowRouter.route('/:orgSerialNumber/standards', {
  name: 'standards',
  action(params) {
    BlazeLayout.render('StandardsLayout', {
      headerTitle: 'Standards book',
      contentList: 'StandardsList',
      contentCard: 'StandardsCard'
    });
  }
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  triggersEnter: [checkLoggedIn],
  action(params) {
    BlazeLayout.render('DashboardLayout', {
      content: 'DashboardPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/users', {
  name: 'userDirectoryPage',
  triggersEnter: [checkLoggedIn],
  action(params) {
    BlazeLayout.render('UserDirectoryLayout', {
      content: 'UserDirectoryPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/users/:userId', {
  name: 'userDirectoryUserPage',
  triggersEnter: [checkLoggedIn],
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
