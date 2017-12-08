import { Meteor } from 'meteor/meteor';

export default {
  _searchString() {
    const child = this.child('Select_Single') || this.child('Select_Multi');
    return child && child.value();
  },
  _members(_query = {}, options = { sort: { 'profile.firstName': 1 } }, defaultSearch = true) {
    this.load({ mixin: 'organization' });
    const organization = this.organization();
    const memberIds = organization && organization.getMemberIds() || [];
    const query = {
      _id: { $in: memberIds },
<<<<<<< HEAD
      ...this.searchObject('_searchString', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]),
      ..._query,
=======
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
    };

    if (defaultSearch) {
      Object.assign(query, this.searchObject('_searchString', [
        { name: 'profile.firstName' },
        { name: 'profile.lastName' },
        { name: 'emails.0.address' },
      ]));
    }

    Object.assign(query, _query);

    return this._mapMembers(Meteor.users.find(query, options));
  },
  _mapMembers(array) {
    return array.map(doc => ({ title: this.userNameOrEmail(doc), ...doc }));
  },
};
