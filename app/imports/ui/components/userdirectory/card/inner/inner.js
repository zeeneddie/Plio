import { Template } from 'meteor/templating';
import { UserRolesNames } from '/imports/api/constants.js';

Template.UserDirectory_Card_Read_Inner.viewmodel({
  mixin: ['user', 'organization'],

  phoneType(type) {
    return `${type} phone`;
  },
  isInvitationAccepted() {
    const user = this.user();
    return !user.invitationId;
  },
  isEmailVerified() {
    const user = this.user();
    const email = user.emails[0];
    return email.verified;
  },
  superpowersTitle() {
    const user = this.user();

    if (this.organization()) {
      return `${this.userNameOrEmail(user)}'s superpowers for ${this.organization().name}`
    }
  },
  orgOwnerLabel() {
    const userId = this.user()._id;
    const organization = this.organization();

    if (userId && organization) {
      const orgName = organization.name;
      if (userId === organization.ownerId()) {
        return `Organization owner for organization "${orgName}"`;
      }
    }
  },
  superpowers() {
    const user = this.user();

    if (this.organization()) {
      const orgId = this.organization()._id;
      const userRoles = user.roles[orgId] || [];

      const superpowers = Object.keys(UserRolesNames).map((key) => {
        return { key, value: UserRolesNames[key], flag: userRoles.indexOf(key) !== -1 };
      });
      return superpowers.sort((a, b) => {
        return b.flag - a.flag;
      });
    }
  },
});
