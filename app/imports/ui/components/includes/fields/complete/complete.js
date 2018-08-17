import { Template } from 'meteor/templating';

Template.Completion_Edit.viewmodel({
  isButtonVisible: true,
  isFormVisible: false,
  text: '',
  placeholder: 'Enter any verification comments',
  buttonDefaultText: 'Complete',
  buttonSuccessText: 'Complete',
  buttonFailText: 'Assessed as ineffective',
  canButtonBeShown: false,
  getButtonText() {
    return this.isFormVisible()
      ? 'Cancel'
      : this.buttonDefaultText();
  },
  onComplete(vm) {},
  complete() {
    this.onComplete(this);
  },
  hasFailFn() {
    return !!this.onFail;
  },
  fail() {
    this.onFail && this.onFail(this);
  },
  onUndo(vm) {},
  undo() {
    this.onUndo();
  },
  getData() {
    const { text } = this.data();
    return { text };
  },
});
