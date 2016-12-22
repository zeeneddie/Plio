import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/share/collections/organizations.js';
import { isMobileRes } from '/imports/api/checkers.js';
import { flattenObjects } from '/imports/api/helpers.js';
import { MyPreferencesHelp } from '/imports/api/help-messages.js';
import { userLogout } from '/imports/client/store/actions/globalActions';

const STATUSES = [
  {
    text: 'Online',
    css: 'text-success',
    status: 'online'
  },
  {
    text: 'Away',
    css: 'text-warning',
    status: 'away'
  },
  {
    text: 'Offline',
    css: 'text-danger',
    status: 'offline'
  }
];

Template.UserMenu.viewmodel({
  share: 'window',
  mixin: ['user', 'modal', 'organization', 'roles', 'mobile', 'store'],
  linkArgs() {
    const className = 'dropdown-item';
    const orgSerialNumber = this.organizationSerialNumber();
    const userId = Meteor.userId();
    const getPath = (path, params) => FlowRouter.path(path, { ...params, orgSerialNumber });

    const myProfile = () => {
      const href = getPath('userDirectoryUserPage', { userId });

      return {
        href,
        onClick: () => this.goToMyProfile(href)
      }
    };

    const links = {
      myProfile: myProfile(),
      myPreferences: {
        onClick: this.openUserPreferences.bind(this)
      },
      userDirectory: {
        href: getPath('userDirectoryPage')
      },
      inviteUsers: {
        onClick: this.onInviteClick.bind(this)
      },
      logout: {
        onClick: this.logout.bind(this)
      }
    };

    const status = (index) => {
      const active = this.isActiveStatus(index) ? 'active' : '';
      return {
        className: `${className} pointer ${active}`,
        onClick: this.changeStatus.bind(this)
      };
    };

    const wrapWithClassName = keys => key =>
      ({ [key]: Object.assign({}, keys[key], { className }) });

    const mappedLinks = flattenObjects(Object.keys(links).map(wrapWithClassName(links)));

    return {
      ...mappedLinks,
      status
    }
  },
  getStatuses() {
    return STATUSES;
  },
  isActiveStatus(index) {
    const user = Meteor.user();
    const currentStatus = STATUSES[index].text.toLowerCase() ||
                          user.statusDefault;
    const statusDefault = user.statusDefault;

    return currentStatus === statusDefault;
  },
  getActiveClass() {
    const user = Meteor.user();
    const userStatus = user.status;
    const activeStatus = STATUSES.find((status) => {
      return status.text.toLowerCase() === userStatus;
    });

    return (activeStatus && activeStatus.css) || STATUSES[0].css;
  },
  orgSerialNumber() {
    return FlowRouter.getParam('orgSerialNumber');
  },
  changeStatus(e) {
    e.preventDefault();

    const status = $(e.target).text().trim().toLowerCase();
    if (status != Meteor.user().statusDefault) {
      Meteor.call('UserPresence:setDefaultStatus', status);
    }
  },
  onInviteClick(event) {
    event.preventDefault();
    let orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    let organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;

    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      _title: 'Invite users',
      submitCaption: 'Invite',
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save',
      organizationId
    });
  },
  goToMyProfile(href) {
    const mobileWidth = isMobileRes();

    if (mobileWidth) {
      this.width(mobileWidth);
    }

    FlowRouter.go(href);
  },
  logout(e) {
    e.preventDefault();

    Meteor.logout(() => {
      this.dispatch(userLogout);
      FlowRouter.go('signIn');
    });
  },
  openUserPreferences(e) {
    e.preventDefault();

    this.modal().open({
      template: 'UserPreferences',
      _title: 'My preferences',
      helpText: MyPreferencesHelp.myPreferences,
      userId: Meteor.userId()
    });
  }
});
