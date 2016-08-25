import { Template } from 'meteor/templating';

Template.RCA_ToBeCompletedBy_Edit.viewmodel({
  mixin: ['user', 'search', 'members'],
  assignee: '',
  comments: '',
  selectFirstIfNoSelected: false,
  placeholder: '',
  label: '',
  isButtonVisible: false,
  canButtonBeShown() {
    return this.getAssignee() === Meteor.userId();
  },
  getAssignee() {
    return this.assignee() || '';
  },
  onUpdate() {},
  update() {
    return (viewmodel) => {
      const currentAssignee = this.templateInstance.data.assignee;
      const { selected:executor } = viewmodel.getData();

      if (Object.is(executor, currentAssignee)) return;

      this.assignee(executor);

      this.onUpdate({ executor }, err => err && this.assignee(currentAssignee));
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
