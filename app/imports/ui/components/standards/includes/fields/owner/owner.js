import { Template } from 'meteor/templating';

Template.ESOwner.viewmodel({
  mixin: ['search', 'user', 'modal'],
  onCreated() {
    if (this.hasUser() && !this.isEditable() && this.showCurrentUser && this.showCurrentUser()) {
      this.selectOwner(Meteor.user());
    }
  },
  autorun() {
    console.log(this.selectedOwnerId());
    if (this.selectedOwnerId()) {
      const fullName = this.userFullNameOrEmail(this.selectedOwnerId());

      this.owner(fullName);
    }
  },
  isEditable: false,
  label: 'Owner',
  sm: 8,
  owner: '',
  selectedOwnerId: '',
  members() {
    const query = this.searchObject('owner', ['profile.firstName', 'profile.lastName']);
    const options = { sort: { 'profile.firstName': 1 } };

    return Meteor.users.find(query, options);
  },
  selectOwner(doc) {
    const { _id } = doc;

    this.selectedOwnerId(_id);
    this.update();
  },
  update() {
    if (!this.isEditable()) return;

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
      this.selectedOwnerId('');
    }
  }
});
