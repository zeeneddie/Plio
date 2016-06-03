import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.NCIdentifiedBy.viewmodel({
  mixin: 'search',
  identifiedBy: '',
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
    return this.update.bind(this);
  },
  update(viewmodel) {
    if (!this._id) return;

    const { owner:identifiedBy } = viewmodel.getData();

    return this.parent().update({ identifiedBy });
  },
  getData() {
    const { owner:identifiedBy } = this.child('OwnerField').getData();
    return { identifiedBy };
  }
});
