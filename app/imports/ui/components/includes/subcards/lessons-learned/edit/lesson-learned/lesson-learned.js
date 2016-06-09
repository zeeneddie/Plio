import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Subcards_LessonLearned.viewmodel({
  mixin: ['search', 'user'],
  title: '',
  date: new Date(),
  owner: Meteor.userId(),
  notes: '<div></div>',
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
  onChangeDateCb() {
    return this.onChangeDate.bind(this);
  },
  onChangeDate(viewmodel) {
    const { date } = viewmodel.getData();

    if (this.templateInstance.data.date === date) return;

    this.date(date);
  },
  onUpdateOwnerCb() {
    return this.onUpdateOwner.bind(this);
  },
  onUpdateOwner(viewmodel) {
    const { selected:owner } = viewmodel.getData();

    if (this.templateInstance.data.owner === owner) return;

    this.owner(owner);
  },
  getData() {
    const { title, date, owner } = this.data();
    const notes = this.child('QuillEditor').editor().getHTML();
    return { title, date, owner, notes };
  }
});
