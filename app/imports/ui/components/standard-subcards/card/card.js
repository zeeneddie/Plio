import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { UserRolesNames } from '/imports/share/constants.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import { Occurrences } from '/imports/share/collections/occurrences.js';


Template.SS_Card_Read.viewmodel({
  share: 'window',
  mixin: ['modal', 'nonconformity', 'standard', 'risk', 'workInbox', 'user', 'mobile'],
  autorun() {
    this.templateInstance.subscribe('NCImprovementPlan', this.NCId());
  },
  // NC from fixture: "Inquiry not recorded"
  NCId: "P98SExuNHZ4y8bhjc",
  organizationId: "KwKXz5RefrE5hjWJ2",
  // Standard from fixture: "3. Inquiry handling"
  StandardId: "4hecb3Gzvg5dPp7rD",
  // Risk from fixture: "Explosion of binder"
  RiskId: "aqtqWNPrc9fNi6wyp",
  // Action from fixture: "CA1 Fix machine calibration"
  ActionId: "hR3QzcjMKfZv9RQLe",
  // Steve Ives ID
  UserId: "SQHmBKJ94gJvpLKLt",
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  occurrences() {
    const query = { nonConformityId: get(this.NC(), '_id') };
    const options = { sort: { serialNumber: 1 } };
    return Occurrences.find(query, options);
  },
  risk() {
    return this._getRiskByQuery({ _id: this.RiskId() });
  },
  action() {
    return this._getActionByQuery({ _id: this.ActionId() });
  },
  organization() {
    return Organizations.findOne();
  },
  user() {
    return Meteor.users.findOne(this.UserId());
  },
  _getNCsQuery() {
    return { standardsIds: this.StandardId() };
  },
  phoneType(type) {
    return `${type} phone`;
  },
  superpowersTitle(user) {
    if (this.organization()) {
      return `${this.userNameOrEmail(user)}'s superpowers for ${this.organization().name}`
    }
  },
  orgOwnerLabel() {
    const userId = this.UserId();
    const organization = this.organization();
    const user = this.user();
    if (userId && organization) {
      const orgName = organization.name;
      if (userId === organization.ownerId()) {
        return `Organization owner for organization "${orgName} and has the full set of superpowers"`;
      }
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
  onOpenEditModalCb() {
    return this.openEditModal.bind(this);
  },
  openEditModal() {
    this.modal().open({
      _title: 'Standard subcards',
      template: 'SS_Card_Modal',
      NCId: this.NCId(),
      StandardId: this.StandardId(),
      RiskId: this.RiskId(),
      ActionId: this.ActionId(),
      UserId: this.UserId()
    });
  },
});
