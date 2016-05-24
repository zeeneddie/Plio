import { Template } from 'meteor/templating';

Template.ESOwner.viewmodel({
  mixin: ['search', 'user', 'modal'],
  onCreated() {
    if (this.hasUser() && !this.isEditable() && this.showCurrentUser()) {
      this.selectOwner(Meteor.user());
    } else {
      this.checkSelectedOwner();
    }
  },
  isEditable: false,
  showCurrentUser: false,
  label: 'Owner',
  sm: 8,
  owner: '',
  selectedOwnerId: '',
  members() {
    const query = this.searchObject('owner', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]);
    const options = { sort: { 'profile.firstName': 1 } };

    return Meteor.users.find(query, options);
  },
  selectOwner(doc) {
    const { _id } = doc;

    this.selectedOwnerId(_id);

    this.fixOwner();

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
  checkSelectedOwner() {
    if (!this.owner() && !!this.selectedOwnerId()) {
      this.fixOwner();
    }
  },
  fixOwner() {
    const fullName = this.userFullNameOrEmail(this.selectedOwnerId());

    this.owner(fullName);
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
