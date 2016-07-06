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
  },
  getLinkStandardFn() {
    return ({ standardId }, cb) => {
      this.parent().callUpdate(this.linkStandardFn, {
        _id: this._id(),
        standardId
      }, cb);
    };
  },
  getUnlinkStandardFn() {
    return ({ standardId }, cb) => {
      this.parent().callUpdate(this.unlinkStandardFn, {
        _id: this._id(),
        standardId
      }, cb);
    };
  },
  getLinkProblemFn() {
    return ({ problemId, problemType }, cb) => {
      this.parent().callUpdate(this.linkProblemFn, {
        _id: this._id(),
        problemId,
        problemType
      }, cb);
    };
  },
  getUnlinkProblemFn() {
    return ({ problemId, problemType }, cb) => {
      this.parent().callUpdate(this.unlinkProblemFn, {
        _id: this._id(),
        problemId,
        problemType
      }, cb);
    };
  },
  getData() {
    return this.child('Actions_Edit').getData();
  }
});
