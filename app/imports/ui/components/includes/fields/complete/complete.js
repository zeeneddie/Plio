import { Template } from 'meteor/templating';

import { StringLimits } from '../../../../../share/constants';

Template.Completion_Edit.viewmodel({
  isButtonVisible: true,
  isFormVisible: false,
  text: '',
  placeholder: 'Enter any verification comments',
  buttonDefaultText: 'Complete',
  buttonSuccessText: 'Complete',
  buttonFailText: 'Assessed as ineffective',
  canButtonBeShown: false,
  maxLength: StringLimits.comments.max,
  getButtonText() {
    return this.isFormVisible()
      ? 'Cancel'
      : this.buttonDefaultText();
  },
  onComplete() {},
  complete() {
    this.onComplete(this);
  },
  hasFailFn() {
    return !!this.onFail;
  },
  fail() {
    return this.onFail && this.onFail(this);
  },
  onUndo() {},
  undo() {
    this.onUndo();
  },
  getData() {
    const { text } = this.data();
    return { text };
  },
});
