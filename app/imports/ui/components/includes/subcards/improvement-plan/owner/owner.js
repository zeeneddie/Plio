import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.IPOwner.viewmodel({
  mixin: ['search', 'user'],
  owner: '',
  ownerSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  members() {
    const query = this.searchObject('ownerSearchText', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]);
    const options = { sort: { 'profile.firstName': 1 } };

    return Meteor.users.find(query, options).map(({ _id, ...args }) => ({ title: this.userFullNameOrEmail(_id), _id, ...args }) );
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel, cb) {
    const { selected:owner } = viewmodel.getData();

    if (owner === this.templateInstance.data.owner) return;

    this.owner(owner);

    this.parent().update({ owner }, cb);
  },
  getData() {
    const { owner } = this.data();
    return { owner };
  }
});
