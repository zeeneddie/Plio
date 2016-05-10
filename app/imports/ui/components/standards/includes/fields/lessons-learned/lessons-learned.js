import { Template } from 'meteor/templating';

Template.ESLessonsLearned.viewmodel({
  mixin: 'collapse',
  lessons() {
    return this.standard() && this.standard().lessons;
  },
  addLesson() {
    Blaze.renderWithData(
      Template.ESLessons,
      {},
      this.container[0]
    );
  }
});
