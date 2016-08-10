import { Template } from 'meteor/templating';

Template.RCA_ToBeCompletedBy_Edit.viewmodel({
  mixin: ['user', 'search', 'members'],
  key: '',
  by: '',
  comments: '',
  selectFirstIfNoSelected: false,
  placeholder: '',
  label: '',
  isButtonVisible: false,
  canButtonBeShown() {
    return this.getBy() === Meteor.userId();
  },
  getBy() {
    return this.by() || '';
  },
  onUpdate() {},
  update(viewmodel) {
    return (viewmodel) => {
      const { selected:executor } = viewmodel.getData();

      if (executor === this.templateInstance.data.by) return;

      this.by(executor);

      this.onUpdate({ executor });
    };
  },
  onComplete() {},
  complete() {
    return (viewmodel) => {
      const { text:completionComments } = viewmodel.getData();

      this.onComplete({ completionComments });
    };
  },
  onUndo() {},
  undo() {
    return viewmodel => this.onUndo();
  }
});
