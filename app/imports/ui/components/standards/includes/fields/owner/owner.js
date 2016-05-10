import { Template } from 'meteor/templating';

Template.ESOwner.viewmodel({
  mixin: ['search', 'user', 'modal'],
  onCreated() {
    if (this.hasUser() && !this._id) {
      this.selectOwner(Meteor.user());
    } else if (this.hasUser() && this._id) {
      const fullName = this.userFullNameOrEmail(this.selectedOwnerId());
      this.owner(fullName);
    }
  },
  owner: '',
  selectedOwnerId: '',
  members() {
    const query = this.searchObject('owner', ['profile.firstName', 'profile.lastName']);
    const options = { sort: { 'profile.firstName': 1 } };
    return Meteor.users.find(query, options);
  },
  selectOwner(doc) {
    const { _id } = doc;
    const fullName = this.userFullNameOrEmail(doc);
    this.owner(fullName);
    this.selectedOwnerId(_id);
    this.update();
  },
  update() {
    if (!this._id || this._id !== 'placeholder') return;
    const { owner } = this.getData();
    if (!owner) {
      this.modal().setError('Owner is required!');
      return;
    }

    this.parent().update({ owner });
  },
  getData() {
    const { selectedOwnerId:owner } = this.data();
    return { owner };
  },
  events: {
    'focus input'() {
      this.owner('');
    }
  }
});
