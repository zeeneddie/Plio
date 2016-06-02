import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { Meteor } from 'meteor/meteor';

Template.OwnerField.viewmodel({
  mixin: ['search', 'user'],
  onCreated() {
    if (!this.ownerId()) {
      const { _id } = Meteor.user();
      const name = Meteor.user().fullNameOrEmail();
      this.owner(name);
      this.ownerId(_id);
    }
  },
  owner: '',
  ownerId: '',
  items: [],
  select(doc) {
    const { _id } = doc;

    this.ownerId(_id);

    this.fixOwner();

    this.update();
  },
  update() {
    return this.onUpdate(this);
  },
  checkSelectedOwner() {
    if (!this.owner() && !!this.ownerId()) {
      this.fixOwner();
    }
  },
  fixOwner() {
    const fullName = this.userFullNameOrEmail(this.ownerId());

    this.owner(fullName);
  },
  getData() {
    const { ownerId:owner } = this.data();
    return { owner };
  },
  events: {
    'focus input'() {
      this.owner('');
    }
  }
});
