import { Template } from 'meteor/templating';

Template.ESOwner.viewmodel({
  mixin: ['search', 'fullName'],
  owner: '',
  selectedOwnerId: '',
  members() {
    const query = this.searchObject('owner', ['profile.firstName', 'profile.lastName']);
    const options = { sort: { 'profile.firstName': 1 } };
    return Meteor.users.find(query, options);
  },
  selectOwner(doc) {
    const { _id } = doc;
    const fullName = this.fullName(doc);
    this.owner(fullName);
    this.selectedOwnerId(_id);
  },
  getData() {
    const { selectedOwnerId:owner } = this.data();
    return { owner };
  }
});
