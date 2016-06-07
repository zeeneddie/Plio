import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.RKOwner.viewmodel({
  mixin: ['search'],
  owner() {
    const child = this.child('OwnerField');
    return child && child.owner();
  },
  members() {
    const query = this.searchObject('owner', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]);
    const options = { sort: { 'profile.firstName': 1 } };

    return Meteor.users.find(query, options);
  },
  onUpdateCb() {
    return this.onUpdate.bind(this);
  },
  onUpdate(viewmodel) {
    const { owner } = viewmodel.getData();
    const modifier = { $addToSet: { owners: owner } };
  },
  deleteOwnerFn() {
    return this.pull.bind(this, Template.currentData());
  },
  pull({ _id }) {

  },
  getData() {
    const { owner } = this.child('OwnerField').getData();
    return { owner };
  }
});
