import { Template } from 'meteor/templating';

Template.Completion_Edit.viewmodel({
  isButtonVisible: true,
  isFormVisible: false,
  text: '',
  placeholder: 'Comments',
  buttonText: 'Complete',
  canButtonBeShown: false,
  getButtonText() {
    return this.isFormVisible()
            ? 'Cancel'
            : this.buttonText();
  },
  onComplete(vm) {},
  complete() {
    this.onComplete(this);
  },
  onUndo(vm) {},
  undo() {
    this.onUndo();
  },
  getData() {
    const { text } = this.data();
    return { text };
  }
});
