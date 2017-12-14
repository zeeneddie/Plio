import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { updateViewedBy } from '/imports/api/lessons/methods.js';
import { isViewed } from '/imports/api/checkers';

Template.Subcards_LessonLearned.viewmodel({
  mixin: ['search', 'user', 'members'],
  title: '',
  date: new Date(),
  notes: '<div></div>',
  linkedTo: '',
  linkedToId: '',
  owner: '',
  onCreated() {
    !this.owner() && this.owner(Meteor.userId());
  },
  onRendered(templateInstance) {
    const doc = templateInstance.data.document;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: doc._id }));
    }
  },
  titleArgs() {
    const { title: value } = this.data();
    const withFocusCheck = !!this._id;

    return {
      value,
      withFocusCheck,
      onFocusOut: (e, { value: title }) => {
        this.title(title);

        const cb = err => err && this.title(this.templateInstance.data.title) && false;

        return invoke(this.parent(), 'update', { title }, cb);
      },
    };
  },
  selectArgs() {
    const { owner: value } = this.data();

    return {
      value,
      onUpdate: this.onUpdateOwner.bind(this),
    };
  },
  onChangeDateCb() {
    return this.onChangeDate.bind(this);
  },
  onChangeDate(viewmodel) {
    const { date } = viewmodel.getData();

    if (this.templateInstance.data.date === date) return;

    this.date(date);
    this.parent().update({ date });
  },
  onUpdateOwner(viewmodel) {
    const { selected: owner } = viewmodel.getData();

    this.owner(owner);
    this.parent().update({ owner });
  },
  onUpdateNotesCb() {
    return this.updateNotes.bind(this);
  },
  updateNotes(e, viewmodel) {
    const { html: notes } = viewmodel.getData();

    if (this.templateInstance.notes === notes) return;

    this.notes(notes);

    this.parent().update({ e, withFocusCheck: true, notes });
  },
  getData() {
    const {
      title, date, owner, notes,
    } = this.data();
    return {
      title, date, owner, notes,
    };
  },
});
