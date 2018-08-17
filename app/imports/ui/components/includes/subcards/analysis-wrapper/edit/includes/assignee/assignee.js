import { Template } from 'meteor/templating';

Template.Analysis_ToBeCompletedBy_Edit.viewmodel({
  assignee() { return Meteor.userId(); },
  comments: '',
  selectFirstIfNoSelected: false,
  placeholder: 'Assignee',
  label: '',
  isButtonVisible: false,
  disabled: false,
  selectArgs() {
    const {
      assignee: value = '',
      selectFirstIfNoSelected,
      placeholder,
      disabled,
    } = this.data();
    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      onUpdate: (viewmodel) => {
        const { selected: executor } = viewmodel.getData();

        this.assignee(executor);

        const cb = err => err && this.assignee(this.templateInstance.data.assignee) && false;

        return this.onUpdate({ executor }, cb);
      },
    };
  },
  canButtonBeShown() {
    return this.getAssignee() === Meteor.userId();
  },
  getAssignee() {
    return this.assignee() || '';
  },
  onUpdate() {},
  onComplete() {},
  complete() {
    return (viewmodel) => {
      const { text: completionComments } = viewmodel.getData();

      this.onComplete({ completionComments });
    };
  },
  onUndo() {},
  undo() {
    return viewmodel => this.onUndo();
  },
});
