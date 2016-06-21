import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.Subcards_LessonLearned.viewmodel({
  mixin: ['search', 'user', 'members'],
  autorun() {
    this.title.depend();

    if (!this._id) {
      this.parent()._lText(this.title.value);
    }
  },
  title: '',
  date: new Date(),
  owner: Meteor.userId(),
  notes: '<div></div>',
  linkedTo: '',
  linkedToId: '',
  updateTitle(e) {
    this.parent().update({ title: this.title(), e, withFocusCheck: true });
  },
  onChangeDateCb() {
    return this.onChangeDate.bind(this);
  },
  onChangeDate(viewmodel) {
    const { date } = viewmodel.getData();

    if (this.templateInstance.data.date === date) return;

    this.date(date);
    this.parent().update(null, 'date');
  },
  onUpdateOwnerCb() {
    return this.onUpdateOwner.bind(this);
  },
  onUpdateOwner(viewmodel) {
    const { selected:owner } = viewmodel.getData();

    if (this.templateInstance.data.owner === owner) return;

    this.owner(owner);
    this.parent().update(null, 'owner');
  },
  updateNotes(e) {
    this.parent().update(e, 'notes', true);
  },
  events: {
    'focusout .quill'(e, tpl) {
      this.updateNotes(e);
    }
  },
  getData() {
    const { title, date, owner } = this.data();
    const notes = this.child('QuillEditor').editor().getHTML();
    return { title, date, owner, notes };
  }
});
