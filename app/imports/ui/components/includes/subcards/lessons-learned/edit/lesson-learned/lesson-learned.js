import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Subcards_LessonLearned.viewmodel({
  mixin: ['search', 'user'],
  autorun() {
    console.log(this.date())
  },
  title: '',
  date: '',
  owner: '',
  notes: '',
  linkedTo: '',
  ownerSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  members() {
    const query = this.searchObject('ownerSearchText', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]);
    const options = { sort: { 'profile.firstName': 1 } };

    return Meteor.users.find(query, options).map(({ _id, ...args }) => ({ title: this.userFullNameOrEmail(_id), _id, ...args }) );
  },
});
