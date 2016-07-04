import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_EditSubcard.viewmodel({
  update({ ...args }) {
    this.parent().update({ ...args });
  },
  getCompleteFn() {
    return () => {
      this.parent().callUpdate(this.completeFn, {
        _id: this._id()
      });
    };
  },
  getUndoCompletionFn() {
    return () => {
      this.parent().callUpdate(this.undoCompletionFn, {
        _id: this._id()
      });
    };
  },
  getVerifyFn() {
    return () => {
      this.parent().callUpdate(this.verifyFn, {
        _id: this._id()
      });
    };
  },
  getUndoVerificationFn() {
    return () => {
      this.parent().callUpdate(this.undoVerificationFn, {
        _id: this._id()
      });
    };
  }
});
