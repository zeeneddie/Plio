import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';

Template.ESLessonsLearned.viewmodel({
  mixin: ['collapse', 'modal'],
  onCreated() {
    const _id = this.standard() && this.standard()._id;
    this.templateInstance.subscribe('lessons', _id);
  },
  lessons() {
    return LessonsLearned.find({}, { sort: { date: 1 } });
  },
  addLesson() {
    const view = Blaze.renderWithData(
      Template.ESLessons,
      { standard: this.standard() },
      this.container[0]
    );
  },
  insert(args, cb) {
    this.modal().callMethod(insert, args, cb);
  },
  update(args, cb) {
    this.modal().callMethod(update, args, cb);
  },
  remove({ _id }, cb) {
    this.modal().callMethod(remove, { _id }, cb);
  }
});
