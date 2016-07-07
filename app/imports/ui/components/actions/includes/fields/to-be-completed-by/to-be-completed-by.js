import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  isCompleteFormVisible: false,
  completionResult: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected } = viewmodel.getData();

    this.toBeCompletedBy(selected);

    this.parent().update && this.parent().update({ toBeCompletedBy: selected });
  },
  isCompleteButtonVisible() {
    return this.toBeCompletedBy() === Meteor.userId();
  },
  showCompleteForm() {
    this.isCompleteFormVisible(true);
  },
  hideCompleteForm() {
    this.isCompleteFormVisible(false);
  },
  complete() {
    this.onComplete({ completionResult: this.completionResult() });
  },
  getData() {
    return { toBeCompletedBy: this.toBeCompletedBy() };
  }
});
