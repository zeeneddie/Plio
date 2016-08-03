import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/components';
import '/imports/ui/layouts';
import '/imports/ui/pages';

AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/login',
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

AccountsTemplates.configureRoute('verifyEmail', {
  layoutType: 'blaze',
  name: 'verifyEmail',
  path: '/verify-email',
  layoutTemplate: 'TransitionalLayout',
  template: 'VerifyEmailPage',
  contentRegion: 'content',
  redirect() {
    FlowRouter.go('hello');
    toastr.success('Email verified! Thanks!');
  }
});

AccountsTemplates.configureRoute('forgotPwd', {
  layoutType: 'blaze',
  name: 'forgotPwd',
  path: '/forgot-password',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content'
});

AccountsTemplates.configureRoute('resetPwd', {
  layoutType: 'blaze',
  name: 'resetPwd',
  path: '/reset-password',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content'
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
    BlazeLayout.render('TransitionalLayout', {
      content: 'HelloPage'
    });
  }
});

FlowRouter.route('/sign-out', {
  name: 'signOut',
  action(params) {
    Meteor.logout();
    const targetURL = FlowRouter.getQueryParam('b');
    if (targetURL) {
      FlowRouter.go(targetURL);
    } else {
      FlowRouter.go('hello');
    }
  }
});

FlowRouter.route('/user-waiting', {
  name: 'userWaiting',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('TransitionalLayout', {
      content: 'UserAccountWaitingPage'
    });
  }
});

FlowRouter.route('/transfer-organization/:transferId', {
  name: 'transferOrganization',
  triggersEnter: [checkLoggedIn],
  action(params) {
    BlazeLayout.render('TransitionalLayout', {
      content: 'TransferOrganizationPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/standards', {
  name: 'standards',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('StandardsLayout', {
      content: 'StandardsPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/standards/:standardId', {
  name: 'standard',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('StandardsLayout', {
      content: 'StandardsPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/standards/:standardId/discussion', {
  // http://localhost:3000/98/standards/Zty4NCagWvrcuLYoy/discussion
  name: 'standard',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('StandardDiscussionLayout', {
      content: 'StandardDiscussionPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/standards/:standardId/discussion/:messageId', {
  name: 'standard',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    /*BlazeLayout.render('StandardsLayout', {
      content: 'StandardsPage'
    });*/
    console.log('A selected discussion item');
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

FlowRouter.route('/:orgSerialNumber/non-conformities', {
  name: 'nonconformities',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('NC_Layout', {
      content: 'NCPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/non-conformities/:nonconformityId', {
  name: 'nonconformity',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('NC_Layout', {
      content: 'NCPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/risks', {
  name: 'risks',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('RisksLayout', {
      content: 'RisksPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/risks/:riskId', {
  name: 'risk',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('RisksLayout', {
      content: 'RisksPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/work-inbox', {
  name: 'workInbox',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('ActionsLayout', {
      content: 'ActionsPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/work-inbox/:workItemId', {
  name: 'workInboxItem',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('ActionsLayout', {
      content: 'ActionsPage'
    });
  }
});

FlowRouter.route('/:orgSerialNumber/standard-subcards', {
  name: 'standardSubcardsPage',
  triggersEnter: [checkLoggedIn, checkEmailVerified],
  action(params) {
    BlazeLayout.render('StandardSubcardsLayout', {
      content: 'StandardSubcardsPage'
    });
  }
});

function redirectHandler() {
  const targetURL = FlowRouter.getQueryParam('b');
  if (targetURL) {
    FlowRouter.go(targetURL);
  } else {
    FlowRouter.go('hello');
  }
}

function checkLoggedIn(context, redirect) {
  if (!Meteor.loggingIn()) {
    if (!Meteor.user()) {
      redirect('signIn', {}, { b: context.path });
    }
  }
}

function checkEmailVerified(context, redirect) {
  const user = Meteor.user();
  const isOnUserWaiting = context.route.name === 'userWaiting';

  if (user) {
    const email = user.emails[0];

    if (!email.verified) {
      if (!isOnUserWaiting) {
        redirect('userWaiting');
      }
    } else {
      if (isOnUserWaiting) {
        redirect('hello');
      }
    }
  }
}
