import { Template } from 'meteor/templating';
import { UserRolesNames } from '../../../api/constants.js';

Template.UsersDetails.viewmodel({
  mixin: ['user', 'organization', 'modal'],
  phoneType(type) {
    return `${type} phone`;
  },
  isEmailVerified(user) {
    const email = user.emails[0];
    return email.verified;
  },
  emailNotVerifiedText() {
    return 'Email address not yet verified by user';
  },
  superpowersTitle(user) {
    if (this.organization()) {
      return `${this.userFullNameOrEmail(user)}'s superpowers for ${this.organization().name}`
    }
  },
  superpowers(user) {
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
  openEditUserModal(e) {
    e.preventDefault();

    this.modal().open({
      template: 'UserEdit',
      title: 'Edit User',
      userId: this.user()._id
    });
  }
});
