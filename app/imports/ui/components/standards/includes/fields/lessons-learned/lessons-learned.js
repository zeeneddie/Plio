import { Template } from 'meteor/templating';

Template.ESLessonsLearned.viewmodel({
  mixin: 'collapse',
  lessons() {
    return this.standard() && this.standard().lessons;
  },
  addLesson() {
    const view = Blaze.render(
      Template.ESLessons,
      this.container[0]
    );
  }
});
